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
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  
  productosDestacados: Producto[] = [];
  loading = false;
  error = '';

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
      }
    });
  }
}