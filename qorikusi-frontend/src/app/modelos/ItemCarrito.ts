import { Producto } from './Producto';

// Modelo de Item del Carrito
export interface ItemCarrito {
  producto: Producto;
  cantidad: number;
}
