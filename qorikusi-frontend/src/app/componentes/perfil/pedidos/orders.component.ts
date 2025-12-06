// src/app/componentes/perfil/pedidos/orders.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PedidoService, PedidoResponse } from '../../../servicio/pedido.service';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit {
  
  pedidos: PedidoResponse[] = [];
  loading: boolean = true;
  error: string = '';

  constructor(private pedidoService: PedidoService) {}

  ngOnInit() {
    this.cargarPedidos();
  }

  /**
   * Cargar historial de pedidos
   */
  cargarPedidos() {
    this.loading = true;
    this.error = '';

    this.pedidoService.listarPedidos().subscribe({
      next: (pedidos) => {
        this.pedidos = pedidos;
        this.loading = false;
        console.log('📦 Pedidos cargados:', pedidos.length);
      },
      error: (error) => {
        console.error('❌ Error al cargar pedidos:', error);
        this.error = error.message || 'Error al cargar el historial de pedidos';
        this.loading = false;
      }
    });
  }

  /**
   * Obtener clase CSS según el estado del pedido
   */
  getEstadoClass(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'pendiente':
      case 'pagopendiente':
        return 'badge-warning';
      case 'completado':
      case 'entregado':
        return 'badge-success';
      case 'cancelado':
      case 'rechazado':
        return 'badge-danger';
      case 'procesando':
      case 'enviado':
        return 'badge-info';
      default:
        return 'badge-secondary';
    }
  }

  /**
   * Obtener icono según el estado
   */
  getEstadoIcon(estado: string): string {
    switch (estado.toLowerCase()) {
      case 'pendiente':
      case 'pagopendiente':
        return 'fa-clock';
      case 'completado':
      case 'entregado':
        return 'fa-check-circle';
      case 'cancelado':
      case 'rechazado':
        return 'fa-times-circle';
      case 'procesando':
        return 'fa-cog';
      case 'enviado':
        return 'fa-shipping-fast';
      default:
        return 'fa-info-circle';
    }
  }

  /**
   * Formatear estado para mostrar
   */
  formatearEstado(estado: string): string {
    if (estado === 'PagoPendiente') {
      return 'Pago Pendiente';
    }
    return estado;
  }

  /**
   * Calcular total de productos en un pedido
   */
  getTotalProductos(pedido: PedidoResponse): number {
    return pedido.productos.reduce((total, prod) => total + prod.cantidad, 0);
  }
}
