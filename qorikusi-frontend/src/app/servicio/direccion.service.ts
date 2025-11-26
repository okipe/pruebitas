import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';
import {
  DireccionRequest,
  DireccionResponse,
} from '../modelos/Direccion.model';

@Injectable({
  providedIn: 'root',
})
export class DireccionService {
  private apiUrl = `${environment.apiCustomerUrl}/client/addresses`;

  constructor(private http: HttpClient) {}

  /**
   * Crear una nueva dirección
   */
  crearDireccion(direccion: DireccionRequest): Observable<DireccionResponse> {
    return this.http
      .post<DireccionResponse>(this.apiUrl, direccion)
      .pipe(catchError(this.handleError));
  }

  /**
   * Listar todas las direcciones del cliente autenticado
   */
  listarDirecciones(): Observable<DireccionResponse[]> {
    return this.http
      .get<DireccionResponse[]>(this.apiUrl)
      .pipe(catchError(this.handleError));
  }

  /**
   * Obtener una dirección por UUID
   */
  obtenerDireccionPorId(uuidDireccion: string): Observable<DireccionResponse> {
    return this.http
      .get<DireccionResponse>(`${this.apiUrl}/${uuidDireccion}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Actualizar una dirección existente
   */
  actualizarDireccion(
    uuidDireccion: string,
    direccion: DireccionRequest
  ): Observable<DireccionResponse> {
    return this.http
      .put<DireccionResponse>(`${this.apiUrl}/${uuidDireccion}`, direccion)
      .pipe(catchError(this.handleError));
  }

  /**
   * Eliminar una dirección
   */
  eliminarDireccion(uuidDireccion: string): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${uuidDireccion}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Manejo de errores HTTP
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error desconocido';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      const serverError = error.error;

      switch (serverError?.code) {
        case 'CLIENT_NOT_FOUND':
          errorMessage = 'No se encontró la información del cliente';
          break;

        case 'DIRECTION_NOT_FOUND':
          errorMessage = 'No se encontró la dirección';
          break;

        case 'UBIGEO_NOT_FOUND':
          errorMessage = 'El código de ubigeo no es válido';
          break;

        case 'INVALID_TOKEN':
          errorMessage = 'Sesión expirada. Por favor inicia sesión nuevamente';
          break;

        case 'INVALID_REQUEST':
          errorMessage =
            'Datos inválidos. Por favor verifica la información ingresada';
          break;

        case 'INTERNAL_ERROR':
          errorMessage =
            'Error interno del servidor. Por favor intenta más tarde';
          break;

        default:
          if (serverError?.code) {
            errorMessage = `Error: ${serverError.code}`;
          } else {
            errorMessage = `Error del servidor (${error.status})`;
          }
      }
    }

    console.error('Error en DireccionService:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}
