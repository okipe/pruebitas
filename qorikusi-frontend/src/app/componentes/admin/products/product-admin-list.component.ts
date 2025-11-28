import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductoAdminResponse } from '../../../modelos/Producto';
import { ProductoService } from '../../../servicio/producto.service';

@Component({
  selector: 'app-product-admin-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-admin-list.component.html',
  styleUrl: './product-admin-list.component.scss'
})
export class ProductAdminListComponent implements OnInit {

  productos: ProductoAdminResponse[] = [];
  productosFiltrados: ProductoAdminResponse[] = [];
  
  loading = false;
  error = '';
  
  // Filtros
  terminoBusqueda = '';
  filtroEstado: 'todos' | 'activos' | 'inactivos' = 'todos';
  
  // Modal de confirmación
  productoAEliminar: ProductoAdminResponse | null = null;

  constructor(private productoService: ProductoService) {}

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.loading = true;
    this.error = '';

    this.productoService.obtenerProductosAdmin().subscribe({
      next: (response) => {
        this.productos = response.content;
        this.aplicarFiltros();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        this.error = 'No se pudieron cargar los productos. Por favor intenta de nuevo.';
        this.loading = false;
      }
    });
  }

  aplicarFiltros() {
    let resultado = [...this.productos];

    // Filtro de búsqueda
    if (this.terminoBusqueda) {
      const termino = this.terminoBusqueda.toLowerCase();
      resultado = resultado.filter(p =>
        p.nombre.toLowerCase().includes(termino) ||
        p.categoria.toLowerCase().includes(termino) ||
        p.descripcion.toLowerCase().includes(termino)
      );
    }

    // Filtro de estado
    if (this.filtroEstado === 'activos') {
      resultado = resultado.filter(p => p.estado);
    } else if (this.filtroEstado === 'inactivos') {
      resultado = resultado.filter(p => !p.estado);
    }

    this.productosFiltrados = resultado;
  }

  onBusquedaChange() {
    this.aplicarFiltros();
  }

  onFiltroEstadoChange() {
    this.aplicarFiltros();
  }

  cambiarEstado(producto: ProductoAdminResponse) {
    const nuevoEstado = !producto.estado;
    const accion = nuevoEstado ? 'activar' : 'desactivar';
    
    if (confirm(`¿Estás seguro de que deseas ${accion} el producto "${producto.nombre}"?`)) {
      this.productoService.cambiarEstadoProducto(producto.uuidProducto, nuevoEstado).subscribe({
        next: () => {
          producto.estado = nuevoEstado;
          alert(`Producto ${nuevoEstado ? 'activado' : 'desactivado'} correctamente`);
        },
        error: (error) => {
          console.error('Error al cambiar estado:', error);
          alert('No se pudo cambiar el estado del producto');
        }
      });
    }
  }

  confirmarEliminar(producto: ProductoAdminResponse) {
    this.productoAEliminar = producto;
  }

  cancelarEliminar() {
    this.productoAEliminar = null;
  }

  eliminarProducto() {
    if (!this.productoAEliminar) return;

    const producto = this.productoAEliminar;
    
    this.productoService.eliminarProducto(producto.uuidProducto).subscribe({
      next: () => {
        this.productos = this.productos.filter(p => p.uuidProducto !== producto.uuidProducto);
        this.aplicarFiltros();
        this.productoAEliminar = null;
        alert(`Producto "${producto.nombre}" eliminado correctamente`);
      },
      error: (error) => {
        console.error('Error al eliminar producto:', error);
        alert('No se pudo eliminar el producto');
        this.productoAEliminar = null;
      }
    });
  }

  actualizarStock(producto: ProductoAdminResponse) {
    const nuevoStock = prompt(`Ingresa el nuevo stock para "${producto.nombre}":`, producto.stock.toString());
    
    if (nuevoStock === null) return; // Cancelado
    
    const stock = parseInt(nuevoStock, 10);
    
    if (isNaN(stock) || stock < 0) {
      alert('Por favor ingresa un número válido');
      return;
    }

    this.productoService.actualizarStock(producto.uuidProducto, stock).subscribe({
      next: () => {
        producto.stock = stock;
        alert('Stock actualizado correctamente');
      },
      error: (error) => {
        console.error('Error al actualizar stock:', error);
        alert('No se pudo actualizar el stock');
      }
    });
  }

  get resumenFiltrado(): string {
    const total = this.productosFiltrados.length;
    if (this.terminoBusqueda || this.filtroEstado !== 'todos') {
      return `Mostrando ${total} de ${this.productos.length} productos`;
    }
    return `${total} productos`;
  }
}
