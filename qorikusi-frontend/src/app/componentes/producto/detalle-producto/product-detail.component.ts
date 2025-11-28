import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Producto } from '../../../modelos/Producto';
import { ProductoService } from '../../../servicio/producto.service';
import { CarritoService } from '../../../servicio/carrito.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss',
})
export class ProductDetailComponent implements OnInit {
  product: Producto | null = null;
  selectedImageIndex = 0;
  recommendedProducts: Producto[] = [];
  
  loading = false;
  error = '';
  
  // Estado del carrito
  cantidadEnCarrito = 1;
  maxCantidad = 10;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productoService: ProductoService,
    private carritoService: CarritoService
  ) {}

  ngOnInit() {
    // Obtener el UUID del producto de la ruta
    this.route.paramMap.subscribe(params => {
      const uuid = params.get('id');
      if (uuid) {
        this.cargarProducto(uuid);
      } else {
        this.error = 'ID de producto no válido';
      }
    });
  }

  /**
   * Cargar producto por UUID
   */
  cargarProducto(uuid: string) {
    this.loading = true;
    this.error = '';

    this.productoService.obtenerProductoPorId(uuid).subscribe({
      next: (producto) => {
        this.product = producto;
        
        // Configurar cantidad máxima según stock
        this.maxCantidad = Math.min(producto.stock, 10);
        
        // Cargar productos recomendados de la misma categoría
        this.cargarProductosRecomendados(producto.categoria, uuid);
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar producto:', error);
        this.error = 'No se pudo cargar el producto. Por favor intenta de nuevo.';
        this.loading = false;
      }
    });
  }

  /**
   * Cargar productos recomendados de la misma categoría
   */
  cargarProductosRecomendados(categoria: string, excludeUuid: string) {
    this.productoService.obtenerProductos(categoria).subscribe({
      next: (productos) => {
        // Filtrar el producto actual y tomar solo 4
        this.recommendedProducts = productos
          .filter(p => p.uuidProducto !== excludeUuid)
          .slice(0, 4);
      },
      error: (error) => {
        console.error('Error al cargar productos recomendados:', error);
      }
    });
  }

  /**
   * Seleccionar imagen de la galería
   */
  selectImage(index: number) {
    this.selectedImageIndex = index;
  }

  /**
   * Aumentar cantidad
   */
  aumentarCantidad() {
    if (this.cantidadEnCarrito < this.maxCantidad) {
      this.cantidadEnCarrito++;
    }
  }

  /**
   * Disminuir cantidad
   */
  disminuirCantidad() {
    if (this.cantidadEnCarrito > 1) {
      this.cantidadEnCarrito--;
    }
  }

  /**
   * Añadir al carrito
   */
  addToCart() {
    if (!this.product) return;
    
    if (this.product.stock === 0) {
      alert('Este producto está agotado');
      return;
    }

    this.carritoService.agregarProducto(this.product, this.cantidadEnCarrito);
    alert(`${this.product.nombre} (x${this.cantidadEnCarrito}) agregado al carrito`);
    
    // Resetear cantidad
    this.cantidadEnCarrito = 1;
  }

  /**
   * Comprar ahora (añadir al carrito y redirigir)
   */
  buyNow() {
    if (!this.product) return;
    
    if (this.product.stock === 0) {
      alert('Este producto está agotado');
      return;
    }

    this.carritoService.agregarProducto(this.product, this.cantidadEnCarrito);
    this.router.navigate(['/checkout']);
  }

  /**
   * Verificar si el producto está en el carrito
   */
  get estaEnCarrito(): boolean {
    if (!this.product) return false;
    return this.carritoService.estaEnCarrito(this.product.uuidProducto);
  }

  /**
   * Obtener cantidad actual en carrito
   */
  get cantidadActualEnCarrito(): number {
    if (!this.product) return 0;
    return this.carritoService.obtenerCantidadProducto(this.product.uuidProducto);
  }

  /**
   * Obtener imágenes del producto (incluyendo la imagen principal)
   */
  get imagenesProducto(): string[] {
    if (!this.product) return [];
    
    const imagenes = [];
    
    // Agregar imagen principal
    if (this.product.imagen) {
      imagenes.push(this.product.imagen);
    }
    
    // Agregar imágenes adicionales si existen
    if (this.product.imagenes && this.product.imagenes.length > 0) {
      imagenes.push(...this.product.imagenes);
    }
    
    return imagenes;
  }

  /**
   * Verificar si hay stock disponible
   */
  get hayStock(): boolean {
    return this.product ? this.product.stock > 0 : false;
  }

  /**
   * Verificar si es stock bajo
   */
  get esStockBajo(): boolean {
    return this.product ? (this.product.stock > 0 && this.product.stock < 5) : false;
  }
}