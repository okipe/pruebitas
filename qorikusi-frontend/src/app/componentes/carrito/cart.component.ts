import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ItemCarrito } from '../../modelos/ItemCarrito';
import { CarritoService } from '../../servicio/carrito.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss',
})
export class CartComponent implements OnInit {
  cartItems: ItemCarrito[] = [];
  shippingCost: number = 15.0;

  constructor(private router: Router, private carritoService: CarritoService) {}

  ngOnInit() {
    this.loadCartItems();

    // Suscribirse a cambios en el carrito
    this.carritoService.items$.subscribe(() => {
      this.loadCartItems();
    });
  }

  loadCartItems() {
    this.cartItems = this.carritoService.obtenerItems();
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

  increaseQuantity(item: ItemCarrito) {
    // Verificar stock disponible
    if (item.cantidad < item.producto.stock && item.cantidad < 10) {
      item.cantidad++;
      this.carritoService.actualizarCantidad(
        item.producto.uuidProducto,
        item.cantidad
      );
    } else if (item.cantidad >= item.producto.stock) {
      alert(
        `Solo hay ${item.producto.stock} unidades disponibles de este producto`
      );
    } else {
      alert('Máximo 10 unidades por producto');
    }
  }

  decreaseQuantity(item: ItemCarrito) {
    if (item.cantidad > 1) {
      item.cantidad--;
      this.carritoService.actualizarCantidad(
        item.producto.uuidProducto,
        item.cantidad
      );
    }
  }

  updateQuantity(item: ItemCarrito) {
    // Validar cantidad
    if (item.cantidad < 1) {
      item.cantidad = 1;
    } else if (item.cantidad > item.producto.stock) {
      item.cantidad = item.producto.stock;
      alert(`Solo hay ${item.producto.stock} unidades disponibles`);
    } else if (item.cantidad > 10) {
      item.cantidad = 10;
      alert('Máximo 10 unidades por producto');
    }

    this.carritoService.actualizarCantidad(
      item.producto.uuidProducto,
      item.cantidad
    );
  }

  removeItem(item: ItemCarrito) {
    if (confirm(`¿Deseas eliminar "${item.producto.nombre}" del carrito?`)) {
      this.carritoService.eliminarProducto(item.producto.uuidProducto);
    }
  }

  clearCart() {
    if (confirm('¿Estás seguro de que deseas vaciar todo el carrito?')) {
      this.carritoService.vaciarCarrito();
    }
  }

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
  tieneStock(item: ItemCarrito): boolean {
    return item.producto.stock >= item.cantidad;
  }

  /**
   * Obtener máxima cantidad disponible para un item
   */
  getMaxQuantity(item: ItemCarrito): number {
    return Math.min(item.producto.stock, 10);
  }
}
