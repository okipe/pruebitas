// src/app/componentes/carrito/cart.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ItemCarritoCompleto } from '../../modelos/carrito-models';
import { CarritoService } from '../../servicio/carrito.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit, OnDestroy {
  
  cartItems: ItemCarritoCompleto[] = [];
  shippingCost: number = 15.0;
  loading = false;
  error = '';

  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private carritoService: CarritoService
  ) {}

  ngOnInit() {
    // Suscribirse a cambios en el carrito
    this.carritoService.items$
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => {
        this.cartItems = items;
        console.log('🛒 Carrito actualizado:', items);
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getTotalItems(): number {
    return this.carritoService.obtenerCantidadTotal();
  }

  getSubtotal(): number {
    return this.carritoService.obtenerSubtotal();
  }

  getTotal(): number {
    const subtotal = this.getSubtotal();
    const shipping = subtotal >= 250 ? 0 : this.shippingCost;
    return subtotal + shipping;
  }

  /**
   * Aumentar cantidad de un producto
   */
  increaseQuantity(item: ItemCarritoCompleto) {
    const nuevaCantidad = item.cantidad + 1;
    
    // Validaciones
    if (item.producto.stock && nuevaCantidad > item.producto.stock) {
      alert(`Solo hay ${item.producto.stock} unidades disponibles de este producto`);
      return;
    }
    
    if (nuevaCantidad > 10) {
      alert('Máximo 10 unidades por producto');
      return;
    }

    this.loading = true;
    this.carritoService.actualizarCantidad(
      item.producto.uuidProducto,
      nuevaCantidad
    ).subscribe({
      next: () => {
        console.log('✅ Cantidad aumentada');
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Error al aumentar cantidad:', error);
        alert('Error al actualizar la cantidad. Por favor intenta nuevamente.');
        this.loading = false;
      }
    });
  }

  /**
   * Disminuir cantidad de un producto
   */
  decreaseQuantity(item: ItemCarritoCompleto) {
    if (item.cantidad <= 1) {
      return;
    }

    const nuevaCantidad = item.cantidad - 1;
    
    this.loading = true;
    this.carritoService.actualizarCantidad(
      item.producto.uuidProducto,
      nuevaCantidad
    ).subscribe({
      next: () => {
        console.log('✅ Cantidad disminuida');
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Error al disminuir cantidad:', error);
        alert('Error al actualizar la cantidad. Por favor intenta nuevamente.');
        this.loading = false;
      }
    });
  }

  /**
   * Actualizar cantidad manualmente (desde el input)
   */
  updateQuantity(item: ItemCarritoCompleto) {
    // Validar cantidad
    if (item.cantidad < 1) {
      item.cantidad = 1;
    } else if (item.producto.stock && item.cantidad > item.producto.stock) {
      item.cantidad = item.producto.stock;
      alert(`Solo hay ${item.producto.stock} unidades disponibles`);
    } else if (item.cantidad > 10) {
      item.cantidad = 10;
      alert('Máximo 10 unidades por producto');
    }

    this.loading = true;
    this.carritoService.actualizarCantidad(
      item.producto.uuidProducto,
      item.cantidad
    ).subscribe({
      next: () => {
        console.log('✅ Cantidad actualizada');
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Error al actualizar cantidad:', error);
        alert('Error al actualizar la cantidad. Por favor intenta nuevamente.');
        this.loading = false;
      }
    });
  }

  /**
   * Eliminar un producto del carrito
   */
  removeItem(item: ItemCarritoCompleto) {
    if (!confirm(`¿Deseas eliminar "${item.producto.nombre}" del carrito?`)) {
      return;
    }

    this.loading = true;
    this.carritoService.eliminarProducto(item.producto.uuidProducto).subscribe({
      next: () => {
        console.log('✅ Producto eliminado del carrito');
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Error al eliminar producto:', error);
        alert('Error al eliminar el producto. Por favor intenta nuevamente.');
        this.loading = false;
      }
    });
  }

  /**
   * Vaciar todo el carrito
   */
  clearCart() {
    if (!confirm('¿Estás seguro de que deseas vaciar todo el carrito?')) {
      return;
    }

    this.loading = true;
    this.carritoService.vaciarCarrito().subscribe({
      next: () => {
        console.log('✅ Carrito vaciado');
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Error al vaciar carrito:', error);
        alert('Error al vaciar el carrito. Por favor intenta nuevamente.');
        this.loading = false;
      }
    });
  }

  /**
   * Proceder al checkout
   */
  proceedToCheckout() {
    if (this.cartItems.length === 0) {
      alert('Tu carrito está vacío');
      return;
    }

    // Verificar stock antes de proceder
    const itemsSinStock = this.cartItems.filter(
      (item) => item.producto.stock === 0
    );
    
    if (itemsSinStock.length > 0) {
      const nombres = itemsSinStock
        .map((item) => item.producto.nombre)
        .join(', ');
      alert(`Los siguientes productos no tienen stock disponible: ${nombres}`);
      return;
    }

    this.router.navigate(['/checkout']);
  }

  /**
   * Verificar si un item tiene stock disponible
   */
  tieneStock(item: ItemCarritoCompleto): boolean {
    return item.producto.stock >= item.cantidad;
  }

  /**
   * Obtener máxima cantidad disponible para un item
   */
  getMaxQuantity(item: ItemCarritoCompleto): number {
    return Math.min(item.producto.stock, 10);
  }
}
