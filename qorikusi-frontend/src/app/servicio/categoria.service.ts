import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';
import { Categoria } from '../modelos/Categoria';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  private apiUrl = `${environment.apiProductsUrl}/admin/categories`;

  constructor(private http: HttpClient) { }

  /**
   * Obtener todas las categorías disponibles
   * Nota: Este endpoint requiere autenticación de ADMIN
   * Para el catálogo público, usaremos las categorías que vengan en los productos
   */
  obtenerCategorias(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Extraer categorías únicas de una lista de productos
   * Útil para el catálogo público sin necesidad de autenticación ADMIN
   */
  extraerCategoriasDeProductos(productos: any[]): string[] {
    const categorias = productos.map(p => p.categoria);
    return [...new Set(categorias)].sort();
  }

  // ====================================
  // MÉTODOS DE ADMINISTRACIÓN (CRUD)
  // ====================================

  /**
   * 📝 Crear una nueva categoría (requiere autenticación ADMIN)
   */
  crearCategoria(categoria: { nombre: string }): Observable<Categoria> {
    return this.http.post<Categoria>(this.apiUrl, categoria)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * ✏️ Actualizar una categoría existente (requiere autenticación ADMIN)
   */
  actualizarCategoria(id: number, categoria: { nombre: string }): Observable<Categoria> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Categoria>(url, categoria)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * 🗑️ Eliminar una categoría (requiere autenticación ADMIN)
   */
  eliminarCategoria(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Manejo de errores HTTP
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error al obtener las categorías';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      const serverError = error.error;
      
      switch (serverError?.code) {
        case 'CATEGORY_NOT_FOUND':
          errorMessage = 'No se encontraron categorías';
          break;
        
        case 'INVALID_TOKEN':
          errorMessage = 'Sesión expirada. Por favor inicia sesión nuevamente';
          break;
        
        default:
          if (serverError?.code) {
            errorMessage = `Error: ${serverError.code}`;
          }
      }
    }

    console.error('Error en CategoriaService:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}