import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';
import { 
  RetrieveClientDataResponse, 
  UpdateClientDataRequest, 
  UpdateClientDataResponse 
} from '../modelos/Cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  private apiUrl = `${environment.apiCustomerUrl}/client`;

  constructor(private http: HttpClient) { }

  /**
   * Obtener datos del cliente autenticado
   */
  obtenerDatosCliente(): Observable<RetrieveClientDataResponse> {
    return this.http.get<RetrieveClientDataResponse>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Actualizar datos del cliente
   */
  actualizarDatosCliente(datos: UpdateClientDataRequest): Observable<UpdateClientDataResponse> {
    return this.http.patch<UpdateClientDataResponse>(this.apiUrl, datos)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Cambiar correo electrónico
   */
  cambiarCorreo(actualCorreo: string, nuevoCorreo: string): Observable<void> {
    const request = {
      actualCorreo,
      nuevoCorreo
    };
    
    return this.http.post<void>(`${this.apiUrl}/reset-email`, request)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Cambiar contraseña
   */
  cambiarContrasenia(actualContrasenia: string, nuevaContrasenia: string): Observable<void> {
    const request = {
      actualContrasenia,
      nuevaContrasenia
    };
    
    return this.http.post<void>(`${this.apiUrl}/reset-password`, request)
      .pipe(
        catchError(this.handleError)
      );
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
          
        case 'INVALID_CREDENTIALS':
          errorMessage = 'Credenciales inválidas';
          break;
          
        case 'INVALID_TOKEN':
          errorMessage = 'Sesión expirada. Por favor inicia sesión nuevamente';
          break;
          
        case 'INVALID_REQUEST':
          errorMessage = 'Datos inválidos. Por favor verifica la información ingresada';
          break;
          
        case 'INTERNAL_ERROR':
          errorMessage = 'Error interno del servidor. Por favor intenta más tarde';
          break;
          
        default:
          if (serverError?.code) {
            errorMessage = `Error: ${serverError.code}`;
          } else {
            errorMessage = `Error del servidor (${error.status})`;
          }
      }
    }

    console.error('Error en ClienteService:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}