import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Producto } from '../../../modelos/Producto';
import { ProductoService } from '../../../servicio/producto.service';
import { CarritoService } from '../../../servicio/carrito.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent implements OnInit {
  selectedImageIndex = 0;

  product: Producto = {
    id: 1,
    nombre: 'Collar Inti',
    precio: 180.0,
    descripcion:
      'Collar de plata 925 con un cuarzo natural para canalizar energía y elegancia.',
    especificaciones: 'Largo: 45 cm aprox',
    imagen:
      'https://via.placeholder.com/500x500/f5f3f0/3d3d5c?text=Collar+Inti+1',
    imagenes: [
      // ← Ya NO es opcional, siempre está definido
      'https://via.placeholder.com/500x500/f5f3f0/3d3d5c?text=Collar+Inti+1',
      'https://via.placeholder.com/500x500/f5f3f0/3d3d5c?text=Collar+Inti+2',
      'https://via.placeholder.com/500x500/f5f3f0/3d3d5c?text=Collar+Inti+3',
    ],
    categoria: 'Collares',
  };

  recommendedProducts = [
    {
      id: 2,
      nombre: 'Dobleco oro',
      precio: 180.0,
      imagen:
        'https://via.placeholder.com/300x300/f5f3f0/3d3d5c?text=Dobleco+oro',
    },
    {
      id: 3,
      nombre: 'Aretes Moon',
      precio: 200.0,
      imagen:
        'https://via.placeholder.com/300x300/f5f3f0/3d3d5c?text=Aretes+Moon',
    },
    {
      id: 4,
      nombre: 'Collar Lua',
      precio: 120.0,
      imagen:
        'https://via.placeholder.com/300x300/f5f3f0/3d3d5c?text=Collar+Lua',
    },
    {
      id: 5,
      nombre: 'Diosa',
      precio: 250.0,
      imagen: 'https://via.placeholder.com/300x300/f5f3f0/3d3d5c?text=Diosa',
    },
  ];

  constructor(
    private route: ActivatedRoute,
    private productoService: ProductoService,
    private carritoService: CarritoService
  ) {}

  ngOnInit() {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId) {
      this.cargarProducto(Number(productId));
    }
  }

  cargarProducto(id: number) {
    this.productoService.obtenerProductoPorId(id).subscribe((producto) => {
      if (producto) {
        this.product = producto;
      }
    });
  }

  selectImage(index: number) {
    this.selectedImageIndex = index;
  }

  addToCart() {
    this.carritoService.agregarProducto(this.product, 1);
    alert(`"${this.product.nombre}" añadido al carrito`);
  }

  buyNow() {
    this.carritoService.agregarProducto(this.product, 1);
    alert(`Redirigiendo a checkout con "${this.product.nombre}"`);
  }
}
