import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Producto } from '../../modelos/Producto';
import { ItemCarrito } from '../../modelos/ItemCarrito';
import { CarritoService } from '../../servicio/carrito.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit {
  
  cartItems: ItemCarrito[] = [];
  shippingCost: number = 15.00;

  constructor(
    private router: Router,
    private carritoService: CarritoService
  ) {}

  ngOnInit() {
    this.loadCartItems();
  }

  loadCartItems() {
    this.cartItems = this.carritoService.obtenerItems();
  }

  getTotalItems(): number {
    return this.cartItems.reduce((total, item) => total + item.cantidad, 0);
  }

  getSubtotal(): number {
    return this.cartItems.reduce((total, item) => 
      total + (item.producto.precio * item.cantidad), 0
    );
  }

  getTotal(): number {
    const subtotal = this.getSubtotal();
    const shipping = subtotal >= 250 ? 0 : this.shippingCost;
    return subtotal + shipping;
  }

  increaseQuantity(item: ItemCarrito) {
    if (item.cantidad < 99) {
      item.cantidad++;
      this.carritoService.actualizarCantidad(item.producto.id, item.cantidad);
    }
  }

  decreaseQuantity(item: ItemCarrito) {
    if (item.cantidad > 1) {
      item.cantidad--;
      this.carritoService.actualizarCantidad(item.producto.id, item.cantidad);
    }
  }

  updateQuantity(item: ItemCarrito) {
    if (item.cantidad < 1) {
      item.cantidad = 1;
    } else if (item.cantidad > 99) {
      item.cantidad = 99;
    }
    this.carritoService.actualizarCantidad(item.producto.id, item.cantidad);
  }

  removeItem(item: ItemCarrito) {
    if (confirm(`¿Deseas eliminar "${item.producto.nombre}" del carrito?`)) {
      this.carritoService.eliminarProducto(item.producto.id);
      this.loadCartItems();
    }
  }

  clearCart() {
    if (confirm('¿Estás seguro de que deseas vaciar todo el carrito?')) {
      this.carritoService.vaciarCarrito();
      this.loadCartItems();
    }
  }

  proceedToCheckout() {
    this.router.navigate(['/checkout']);
  }
}
