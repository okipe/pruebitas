// src/app/modelos/carrito-models.ts

import { Producto } from './Producto';

/**
 * DTO de respuesta del carrito desde el backend
 */
export interface CarritoResponse {
  uuidCarrito: string;
  detalles: DetalleCarritoResponse[];
  total: number;
}

/**
 * Detalle de un producto en el carrito
 */
export interface DetalleCarritoResponse {
  uuidProducto: string;
  categoria: string;
  nombre: string;
  precio: number;
  cantidad: number;
  subtotal: number;
}

/**
 * Request para agregar un producto al carrito
 */
export interface AgregarProductoRequest {
  uuidProducto: string;
  cantidad: number;
}

/**
 * Request para actualizar cantidad de un producto
 */
export interface ActualizarProductoRequest {
  cantidad: number;
}

/**
 * Item del carrito con información completa del producto
 * (Para uso interno en el frontend)
 */
export interface ItemCarritoCompleto {
  producto: Producto;
  cantidad: number;
  subtotal: number;
}
