import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ItemCarrito } from '../modelos/ItemCarrito';
import { Producto } from '../modelos/Producto';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private items: ItemCarrito[] = [];
  private itemsSubject = new BehaviorSubject<ItemCarrito[]>([]);
  
  items$ = this.itemsSubject.asObservable();

  constructor() {
    this.cargarCarrito();
  }

  obtenerItems(): ItemCarrito[] {
    return this.items;
  }

  agregarProducto(producto: Producto, cantidad: number = 1): void {
    const itemExistente = this.items.find(
      item => item.producto.uuidProducto === producto.uuidProducto
    );
    
    if (itemExistente) {
      itemExistente.cantidad += cantidad;
    } else {
      this.items.push({ producto, cantidad });
    }
    
    this.actualizarCarrito();
  }

  actualizarCantidad(productoUuid: string, cantidad: number): void {
    const item = this.items.find(
      item => item.producto.uuidProducto === productoUuid
    );
    
    if (item) {
      item.cantidad = cantidad;
      this.actualizarCarrito();
    }
  }

  eliminarProducto(productoUuid: string): void {
    this.items = this.items.filter(
      item => item.producto.uuidProducto !== productoUuid
    );
    this.actualizarCarrito();
  }

  vaciarCarrito(): void {
    this.items = [];
    this.actualizarCarrito();
  }

  obtenerCantidadTotal(): number {
    return this.items.reduce((total, item) => total + item.cantidad, 0);
  }

  obtenerSubtotal(): number {
    return this.items.reduce((total, item) => 
      total + (item.producto.precio * item.cantidad), 0
    );
  }

  /**
   * Verificar si un producto está en el carrito
   */
  estaEnCarrito(productoUuid: string): boolean {
    return this.items.some(item => item.producto.uuidProducto === productoUuid);
  }

  /**
   * Obtener la cantidad de un producto en el carrito
   */
  obtenerCantidadProducto(productoUuid: string): number {
    const item = this.items.find(
      item => item.producto.uuidProducto === productoUuid
    );
    return item ? item.cantidad : 0;
  }

  private guardarCarrito(): void {
    localStorage.setItem('carrito', JSON.stringify(this.items));
  }

  private cargarCarrito(): void {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
      this.items = JSON.parse(carritoGuardado);
      this.itemsSubject.next(this.items);
    }
  }

  private actualizarCarrito(): void {
    this.itemsSubject.next(this.items);
    this.guardarCarrito();
  }
}