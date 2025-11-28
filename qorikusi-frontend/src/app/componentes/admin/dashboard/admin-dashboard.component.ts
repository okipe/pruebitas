import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductoService } from '../../../servicio/producto.service';
import { CategoriaService } from '../../../servicio/categoria.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {

  // Estadísticas
  totalProductos = 0;
  productosActivos = 0;
  productosInactivos = 0;
  totalCategorias = 0;
  productosStockBajo = 0;
  valorInventario = 0;

  loading = false;
  error = '';

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService
  ) {}

  ngOnInit() {
    this.cargarEstadisticas();
  }

  cargarEstadisticas() {
    this.loading = true;
    this.error = '';

    // Cargar productos para estadísticas
    this.productoService.obtenerProductosAdmin().subscribe({
      next: (response) => {
        const productos = response.content;
        
        this.totalProductos = productos.length;
        this.productosActivos = productos.filter(p => p.estado).length;
        this.productosInactivos = productos.filter(p => !p.estado).length;
        this.productosStockBajo = productos.filter(p => p.stock < 5 && p.stock > 0).length;
        
        // Calcular valor del inventario
        this.valorInventario = productos.reduce((sum, p) => sum + (p.precio * p.stock), 0);
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar estadísticas:', error);
        this.error = 'No se pudieron cargar las estadísticas';
        this.loading = false;
      }
    });

    // Cargar categorías
    this.categoriaService.obtenerCategorias().subscribe({
      next: (categorias) => {
        this.totalCategorias = categorias.length;
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
      }
    });
  }
}
