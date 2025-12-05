// home.component.ts - VERSIÓN COMPLETA CON TODAS LAS OPCIONES
// Elige la opción que prefieras descomentando las líneas correspondientes

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductoService } from '../../servicio/producto.service';
import { Producto } from '../../modelos/Producto';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  productosDestacados: Producto[] = [];
  loading = false;
  error = '';

  // ============================================
  // OPCIÓN 1: PLACEHOLDERS BÁSICOS (Via Placeholder)
  // ============================================
  // Descomentar estas líneas para usar placeholders básicos
  // placeholderProduct = 'https://via.placeholder.com/600x600/3d3d5c/d4af37?text=Qorikusi+Producto';
  // placeholderAbout = 'https://via.placeholder.com/800x600/3d3d5c/d4af37?text=Qorikusi';

  // ============================================
  // OPCIÓN 2: IMÁGENES REALES (Unsplash)
  // ============================================
  // Descomentar estas líneas para usar imágenes reales de Unsplash
  // placeholderProduct = 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600&h=600&fit=crop&q=80';
  // placeholderAbout = 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=800&h=600&fit=crop&q=80';

  // ============================================
  // OPCIÓN 3: IMÁGENES LOCALES
  // ============================================
  // Descomentar estas líneas cuando tengas las imágenes en public/images/
  placeholderProduct = '/images/placeholder-product.jpg';
  placeholderAbout = '/images/about-qorikusi.jpg';

  constructor(private productoService: ProductoService) {}

  ngOnInit() {
    this.cargarProductosDestacados();
  }

  /**
   * Cargar productos destacados para mostrar en la home
   * Toma los primeros 8 productos activos del catálogo
   */
  cargarProductosDestacados() {
    this.loading = true;
    this.error = '';

    this.productoService.obtenerProductosPaginados(0, 8).subscribe({
      next: (response) => {
        this.productosDestacados = response.content;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar productos destacados:', error);
        this.error = 'No se pudieron cargar los productos';
        this.loading = false;
      },
    });
  }
}
