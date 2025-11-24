import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Producto } from '../../../modelos/Producto';
import { ProductoService } from '../../../servicio/producto.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit {
  viewMode: 'grid' | 'list' = 'grid';
  sortBy: string = '';
  priceMin: number = 0;
  priceMax: number = 2900;

  materials = [
    { id: 1, name: 'Plata', count: 5, checked: true },
    { id: 2, name: 'Oro 18k', count: 1, checked: false },
  ];

  details = [
    { id: 1, name: 'Cuarzo' },
    { id: 2, name: 'Perlas' },
    { id: 3, name: 'Cristales' },
    { id: 4, name: 'Piedras' },
  ];

  allProducts: Producto[] = [];
  filteredProducts: Producto[] = [];

  constructor(private productoService: ProductoService) {}

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    this.productoService.obtenerProductos().subscribe((productos) => {
      this.allProducts = productos;
      this.filteredProducts = [...productos];
    });
  }

  onFilterChange() {
    console.log('Filtros cambiados');
  }

  onSortChange() {
    switch (this.sortBy) {
      case 'price-asc':
        this.filteredProducts.sort((a, b) => a.precio - b.precio);
        break;
      case 'price-desc':
        this.filteredProducts.sort((a, b) => b.precio - a.precio);
        break;
      case 'name':
        this.filteredProducts.sort((a, b) => a.nombre.localeCompare(b.nombre));
        break;
      default:
        this.filteredProducts = [...this.allProducts];
    }
  }
}
