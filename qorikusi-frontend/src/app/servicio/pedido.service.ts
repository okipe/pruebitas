// src/app/servicio/pedido.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';

// ========== MODELOS ==========

export interface CrearPedidoRequest {
  uuidCart: string;
  tipoEnvio?: string;
}

export interface ResumenPedidoResponse {
  uuidPedido: string;
  codigoPedido: string;
  estado: string;
  total: number;
  tipoEnvio: string;
  fechaPedido: string;
}

export interface PedidoResponse {
  uuidPedido: string;
  codigoPedido: string;
  estado: string;
  total: number;
  tipoEnvio: string;
  fechaPedido: string;
  cliente: {
    uuidCliente: string;
  };
  productos: DetallePedidoResponse[];
}

export interface DetallePedidoResponse {
  uuidProducto: string;
  categoria: string;
  nombre: string;
  precio: number;
  cantidad: number;
  subtotal: number;
}

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  
  private apiUrl = `${environment.apiOrdersUrl}/client/orders`;

  constructor(private http: HttpClient) {}

  /**
   * Crear un nuevo pedido a partir de un carrito
   */
  crearPedido(uuidCarrito: string): Observable<ResumenPedidoResponse> {
    const request: CrearPedidoRequest = {
      uuidCart: uuidCarrito,
      tipoEnvio: 'Envío estándar'
    };

    console.log('📦 Creando pedido con carrito:', uuidCarrito);

    return this.http.post<ResumenPedidoResponse>(this.apiUrl, request).pipe(
      tap(response => {
        console.log('✅ Pedido creado exitosamente:', response);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Listar todos los pedidos del cliente autenticado
   */
  listarPedidos(): Observable<PedidoResponse[]> {
    return this.http.get<PedidoResponse[]>(this.apiUrl).pipe(
      tap(pedidos => {
        console.log('📦 Pedidos obtenidos:', pedidos.length);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Obtener detalles de un pedido específico
   */
  obtenerPedido(uuidPedido: string): Observable<PedidoResponse> {
    return this.http.get<PedidoResponse>(`${this.apiUrl}/${uuidPedido}`).pipe(
      tap(pedido => {
        console.log('📦 Pedido obtenido:', pedido);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Manejo de errores HTTP
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error al procesar el pedido';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      const serverError = error.error;

      switch (serverError?.code) {
        case 'ORDER_NOT_FOUND':
          errorMessage = 'Pedido no encontrado';
          break;

        case 'CART_NOT_FOUND':
          errorMessage = 'Carrito no encontrado';
          break;

        case 'PRODUCT_NOT_FOUND':
          errorMessage = 'Uno o más productos no están disponibles';
          break;

        case 'INSUFFICIENT_STOCK':
          errorMessage = 'No hay suficiente stock disponible para completar el pedido';
          break;

        case 'INVALID_TOKEN':
          errorMessage = 'Sesión expirada. Por favor inicia sesión nuevamente';
          break;

        case 'ACCESS_DENIED':
          errorMessage = 'No tienes permiso para acceder a este pedido';
          break;

        case 'SERVICE_COMMUNICATION_ERROR':
          errorMessage = 'Error de comunicación con el servidor. Por favor intenta nuevamente';
          break;

        default:
          if (serverError?.code) {
            errorMessage = `Error: ${serverError.code}`;
          } else {
            errorMessage = `Error del servidor (${error.status})`;
          }
      }
    }

    console.error('❌ Error en PedidoService:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}
