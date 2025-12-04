// src/app/servicio/carrito.service.ts

import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, of } from 'rxjs';
import { map, catchError, tap, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';
import { Producto } from '../modelos/Producto';
import {
  CarritoResponse,
  DetalleCarritoResponse,
  AgregarProductoRequest,
  ActualizarProductoRequest,
  ItemCarritoCompleto,
} from '../modelos/carrito-models';

@Injectable({
  providedIn: 'root',
})
export class CarritoService {
  private apiUrl = `${environment.apiCartUrl}/cart`;

  // BehaviorSubject para emitir cambios en el carrito
  private itemsSubject = new BehaviorSubject<ItemCarritoCompleto[]>([]);
  public items$ = this.itemsSubject.asObservable();

  // UUID del carrito actual (anónimo o autenticado)
  private uuidCarrito: string | null = null;

  constructor(private http: HttpClient) {
    this.inicializarCarrito();
  }

  /**
   * Inicializar el carrito al arrancar la aplicación
   */
  private inicializarCarrito(): void {
    // Intentar obtener UUID del carrito desde localStorage
    const carritoGuardado = localStorage.getItem('uuidCarrito');

    if (carritoGuardado) {
      this.uuidCarrito = carritoGuardado;
      console.log('📦 Carrito existente encontrado:', this.uuidCarrito);
      // Cargar carrito desde el backend
      this.cargarCarritoDesdeBackend();
    } else {
      console.log(
        '🆕 No hay carrito guardado, se creará uno nuevo al agregar el primer producto'
      );
    }
  }

  /**
   * Obtener o crear un carrito
   */
  private obtenerOCrearCarrito(): Observable<string> {
    if (this.uuidCarrito) {
      return of(this.uuidCarrito);
    }

    // Crear nuevo carrito en el backend
    return this.http.post<CarritoResponse>(this.apiUrl, {}).pipe(
      tap((response) => {
        this.uuidCarrito = response.uuidCarrito;
        localStorage.setItem('uuidCarrito', this.uuidCarrito);
        console.log('✅ Nuevo carrito creado:', this.uuidCarrito);
      }),
      map((response) => response.uuidCarrito),
      catchError(this.handleError)
    );
  }

  /**
   * Cargar carrito completo desde el backend
   */
  private cargarCarritoDesdeBackend(): void {
    if (!this.uuidCarrito) {
      console.warn('⚠️ No hay UUID de carrito para cargar');
      return;
    }

    this.http
      .get<CarritoResponse>(`${this.apiUrl}/${this.uuidCarrito}`)
      .pipe(
        map((response) => this.convertirDetallesAItems(response.detalles)),
        catchError((error) => {
          console.error('❌ Error al cargar carrito:', error);
          // Si el carrito no existe, limpiar localStorage
          if (error.status === 404) {
            this.limpiarCarritoLocal();
          }
          return of([]);
        })
      )
      .subscribe((items) => {
        this.itemsSubject.next(items);
      });
  }

  /**
   * Agregar un producto al carrito
   */
  agregarProducto(producto: Producto, cantidad: number = 1): Observable<void> {
    const request: AgregarProductoRequest = {
      uuidProducto: producto.uuidProducto,
      cantidad: cantidad,
    };

    return this.obtenerOCrearCarrito().pipe(
      switchMap((uuidCarrito) =>
        this.http.post<void>(`${this.apiUrl}/${uuidCarrito}/items`, request)
      ),
      tap(() => {
        console.log(`✅ Producto agregado: ${producto.nombre} (x${cantidad})`);
        // Recargar carrito después de agregar
        this.cargarCarritoDesdeBackend();
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Actualizar cantidad de un producto en el carrito
   */
  actualizarCantidad(
    uuidProducto: string,
    nuevaCantidad: number
  ): Observable<void> {
    if (!this.uuidCarrito) {
      return throwError(() => new Error('No hay carrito activo'));
    }

    const request: ActualizarProductoRequest = {
      cantidad: nuevaCantidad,
    };

    return this.http
      .put<void>(
        `${this.apiUrl}/${this.uuidCarrito}/items/${uuidProducto}`,
        request
      )
      .pipe(
        tap(() => {
          console.log(`✅ Cantidad actualizada para producto: ${uuidProducto}`);
          this.cargarCarritoDesdeBackend();
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Eliminar un producto del carrito
   */
  eliminarProducto(uuidProducto: string): Observable<void> {
    if (!this.uuidCarrito) {
      return throwError(() => new Error('No hay carrito activo'));
    }

    return this.http
      .delete<void>(`${this.apiUrl}/${this.uuidCarrito}/items/${uuidProducto}`)
      .pipe(
        tap(() => {
          console.log(`✅ Producto eliminado: ${uuidProducto}`);
          this.cargarCarritoDesdeBackend();
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Vaciar el carrito completamente
   */
  vaciarCarrito(): Observable<void> {
    if (!this.uuidCarrito) {
      return of(void 0);
    }

    return this.http.delete<void>(`${this.apiUrl}/${this.uuidCarrito}`).pipe(
      tap(() => {
        console.log('✅ Carrito vaciado');
        this.itemsSubject.next([]);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Fusionar carrito anónimo con carrito del usuario autenticado
   * Se llama después de iniciar sesión
   */
  fusionarCarritoAlLogin(): Observable<void> {
    const carritoAnonimo = localStorage.getItem('uuidCarrito');

    if (!carritoAnonimo) {
      console.log('ℹ️ No hay carrito anónimo para fusionar');
      return of(void 0);
    }

    console.log('🔄 Iniciando fusión de carrito anónimo:', carritoAnonimo);

    return this.http
      .post<void>(`${this.apiUrl}/${carritoAnonimo}/merge`, {})
      .pipe(
        tap(() => {
          console.log('✅ Carrito fusionado exitosamente');
          // Limpiar el carrito anónimo y cargar el nuevo carrito del usuario
          localStorage.removeItem('uuidCarrito');
          this.uuidCarrito = null;

          // Obtener el nuevo carrito del usuario
          this.obtenerCarritoAutenticado();
        }),
        catchError((error) => {
          console.error('❌ Error al fusionar carrito:', error);
          // Aunque falle la fusión, limpiar el carrito anónimo
          localStorage.removeItem('uuidCarrito');
          this.uuidCarrito = null;
          return of(void 0);
        })
      );
  }

  /**
   * Obtener el carrito del usuario autenticado
   */
  private obtenerCarritoAutenticado(): void {
    this.http
      .post<CarritoResponse>(this.apiUrl, {})
      .pipe(
        catchError((error) => {
          console.error('❌ Error al obtener carrito autenticado:', error);
          return of(null);
        })
      )
      .subscribe((response) => {
        if (response) {
          this.uuidCarrito = response.uuidCarrito;
          localStorage.setItem('uuidCarrito', this.uuidCarrito);
          console.log('✅ Carrito autenticado obtenido:', this.uuidCarrito);
          this.cargarCarritoDesdeBackend();
        }
      });
  }

  /**
   * Limpiar carrito local (cuando el usuario cierra sesión)
   */
  limpiarCarritoLocal(): void {
    localStorage.removeItem('uuidCarrito');
    this.uuidCarrito = null;
    this.itemsSubject.next([]);
    console.log('🗑️ Carrito local limpiado');
  }

  // ========== MÉTODOS DE CONSULTA (SÍNCRONOS) ==========

  /**
   * Obtener items actuales del carrito (desde el BehaviorSubject)
   */
  obtenerItems(): ItemCarritoCompleto[] {
    return this.itemsSubject.value;
  }

  /**
   * Obtener cantidad total de items en el carrito
   */
  obtenerCantidadTotal(): number {
    return this.itemsSubject.value.reduce(
      (total, item) => total + item.cantidad,
      0
    );
  }

  /**
   * Obtener subtotal del carrito
   */
  obtenerSubtotal(): number {
    return this.itemsSubject.value.reduce(
      (total, item) => total + item.subtotal,
      0
    );
  }

  /**
   * Verificar si un producto está en el carrito
   */
  estaEnCarrito(uuidProducto: string): boolean {
    return this.itemsSubject.value.some(
      (item) => item.producto.uuidProducto === uuidProducto
    );
  }

  /**
   * Obtener cantidad de un producto específico en el carrito
   */
  obtenerCantidadProducto(uuidProducto: string): number {
    const item = this.itemsSubject.value.find(
      (item) => item.producto.uuidProducto === uuidProducto
    );
    return item ? item.cantidad : 0;
  }

  /**
   * Obtener UUID del carrito actual
   */
  obtenerUuidCarrito(): string | null {
    return this.uuidCarrito;
  }

  // ========== MÉTODOS PRIVADOS DE UTILIDAD ==========

  /**
   * Convertir detalles del backend a items del frontend
   */
  private convertirDetallesAItems(
    detalles: DetalleCarritoResponse[]
  ): ItemCarritoCompleto[] {
    return detalles.map((detalle) => ({
      producto: {
        uuidProducto: detalle.uuidProducto,
        categoria: detalle.categoria,
        nombre: detalle.nombre,
        descripcion: '',
        precio: detalle.precio,
        stock: 999, // No lo tenemos del detalle, asumir stock suficiente
        imagen: detalle.imagen || '/images/placeholder-product.jpg',
      },
      cantidad: detalle.cantidad,
      subtotal: detalle.subtotal,
    }));
  }

  /**
   * Manejo de errores HTTP
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error al procesar la solicitud del carrito';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      const serverError = error.error;

      switch (serverError?.code) {
        case 'CART_NOT_FOUND':
          errorMessage = 'Carrito no encontrado';
          break;

        case 'PRODUCT_NOT_FOUND':
          errorMessage = 'Producto no encontrado';
          break;

        case 'INSUFFICIENT_STOCK':
          errorMessage = 'Stock insuficiente para el producto';
          break;

        case 'UNAUTHORIZED_CART_ACCESS':
          errorMessage = 'No tienes permiso para acceder a este carrito';
          break;

        case 'INVALID_TOKEN':
          errorMessage = 'Sesión expirada. Por favor inicia sesión nuevamente';
          break;

        default:
          if (serverError?.code) {
            errorMessage = `Error: ${serverError.code}`;
          } else {
            errorMessage = `Error del servidor (${error.status})`;
          }
      }
    }

    console.error('❌ Error en CarritoService:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}
