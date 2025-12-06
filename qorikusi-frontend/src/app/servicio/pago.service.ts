// src/app/servicio/pago.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';

// ========== MODELOS ==========

export enum MetodoPago {
  TARJETA = 'Tarjeta',
  BILLETERA = 'Billetera',
  TRANSFERENCIA = 'Transferencia'
}

export enum TipoComprobante {
  BOLETA = 'Boleta',
  FACTURA = 'Factura'
}

export interface PagoRequest {
  uuidPedido: string;
  monto: number;
  metodoPago: MetodoPago;
  tipoComprobante: TipoComprobante;
  clienteDocumento: string;
  clienteNombre: string;
}

export interface PagoResponse {
  uuidPago: string;
  uuidPedido: string;
  monto: number;
  metodoPago: string;
  estadoPago: string;
  fechaPago: string;
  numeroOperacion: string;
}

export interface ComprobanteResponse {
  // Campos de Boleta
  uuidBoleta?: string;
  dni?: string;
  nombre?: string;
  // Campos de Factura
  uuidFactura?: string;
  ruc?: string;
  razonSocial?: string;
  // Campos comunes
  fechaEmision: string;
  montoTotal: number;
  serie: string;
  numero: string;
  pago: PagoResponse;
}

@Injectable({
  providedIn: 'root'
})
export class PagoService {
  
  private apiUrl = `${environment.apiPaymentsUrl}/client/payments`;

  constructor(private http: HttpClient) {}

  /**
   * Procesar un pago para un pedido
   */
  procesarPago(pagoData: PagoRequest): Observable<ComprobanteResponse> {
    console.log('💳 Procesando pago:', pagoData);

    return this.http.post<ComprobanteResponse>(this.apiUrl, pagoData).pipe(
      tap(response => {
        console.log('✅ Pago procesado exitosamente:', response);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Validar datos de tarjeta (simulado - en producción usar una librería como Stripe)
   */
  validarTarjeta(numeroTarjeta: string, cvv: string, fechaVencimiento: string): boolean {
    // Validación básica de Luhn para número de tarjeta
    const isValidNumber = this.validarLuhn(numeroTarjeta.replace(/\s/g, ''));
    const isValidCVV = /^\d{3,4}$/.test(cvv);
    const isValidExpiry = /^\d{2}\/\d{2}$/.test(fechaVencimiento);

    return isValidNumber && isValidCVV && isValidExpiry;
  }

  /**
   * Algoritmo de Luhn para validar número de tarjeta
   */
  private validarLuhn(numero: string): boolean {
    if (!/^\d+$/.test(numero)) return false;

    let sum = 0;
    let shouldDouble = false;

    for (let i = numero.length - 1; i >= 0; i--) {
      let digit = parseInt(numero.charAt(i), 10);

      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }

      sum += digit;
      shouldDouble = !shouldDouble;
    }

    return sum % 10 === 0;
  }

  /**
   * Formatear número de tarjeta (4 dígitos por grupo)
   */
  formatearNumeroTarjeta(numero: string): string {
    return numero.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
  }

  /**
   * Formatear fecha de vencimiento (MM/YY)
   */
  formatearFechaVencimiento(fecha: string): string {
    const cleaned = fecha.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  }

  /**
   * Detectar tipo de tarjeta por número
   */
  detectarTipoTarjeta(numero: string): string {
    const cleaned = numero.replace(/\s/g, '');

    if (/^4/.test(cleaned)) return 'Visa';
    if (/^5[1-5]/.test(cleaned)) return 'Mastercard';
    if (/^3[47]/.test(cleaned)) return 'American Express';
    if (/^6(?:011|5)/.test(cleaned)) return 'Discover';

    return 'Desconocida';
  }

  /**
   * Manejo de errores HTTP
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error al procesar el pago';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      const serverError = error.error;

      switch (serverError?.code) {
        case 'ORDER_NOT_FOUND':
          errorMessage = 'Pedido no encontrado';
          break;

        case 'PAYMENT_NOT_FOUND':
          errorMessage = 'Pago no encontrado';
          break;

        case 'INVALID_REQUEST':
          errorMessage = 'Datos de pago inválidos. Por favor verifica la información';
          break;

        case 'INVALID_TOKEN':
          errorMessage = 'Sesión expirada. Por favor inicia sesión nuevamente';
          break;

        case 'PAYMENT_DECLINED':
          errorMessage = 'El pago fue rechazado. Por favor intenta con otro método de pago';
          break;

        default:
          if (serverError?.code) {
            errorMessage = `Error: ${serverError.code}`;
          } else {
            errorMessage = `Error del servidor (${error.status})`;
          }
      }
    }

    console.error('❌ Error en PagoService:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}
