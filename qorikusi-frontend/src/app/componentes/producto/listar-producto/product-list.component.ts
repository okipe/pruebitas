import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Producto } from '../../../modelos/Producto';
import { ProductoService } from '../../../servicio/producto.service';
import { CategoriaService } from '../../../servicio/categoria.service';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss',
})
export class ProductListComponent implements OnInit {
  // Datos
  allProducts: Producto[] = [];
  filteredProducts: Producto[] = [];
  categorias: string[] = [];
  energiasLunares: string[] = [];

  // UI Estado
  viewMode: 'grid' | 'list' = 'grid';
  loading = false;
  error = '';

  // Filtros
  terminoBusqueda = '';
  categoriaSeleccionada = '';
  energiaLunarSeleccionada = '';
  precioMin: number | undefined;
  precioMax: number | undefined;
  sortBy = '';

  // Paginación (opcional, para mostrar de a poco)
  productosPorPagina = 12;
  paginaActual = 1;

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService
  ) {}

  ngOnInit() {
    this.cargarProductos();
  }

  /**
   * Cargar todos los productos del catálogo
   */
  cargarProductos() {
    this.loading = true;
    this.error = '';

    this.productoService.obtenerProductos().subscribe({
      next: (productos) => {
        this.allProducts = productos;
        this.filteredProducts = [...productos];
        
        // Extraer categorías únicas
        this.categorias = this.categoriaService.extraerCategoriasDeProductos(productos);
        
        // Extraer energías lunares únicas
        this.energiasLunares = this.extraerEnergiasLunares(productos);
        
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        this.error = 'No se pudieron cargar los productos. Por favor intenta de nuevo.';
        this.loading = false;
      }
    });
  }

  /**
   * Aplicar todos los filtros y ordenamiento
   */
  aplicarFiltros() {
    this.filteredProducts = this.productoService.aplicarFiltrosYOrdenamiento(
      this.allProducts,
      {
        busqueda: this.terminoBusqueda,
        categoria: this.categoriaSeleccionada,
        precioMin: this.precioMin,
        precioMax: this.precioMax,
        energiaLunar: this.energiaLunarSeleccionada,
        ordenamiento: this.sortBy
      }
    );

    // Resetear paginación al aplicar filtros
    this.paginaActual = 1;
  }

  /**
   * Manejar cambio en búsqueda
   */
  onBusquedaChange() {
    this.aplicarFiltros();
  }

  /**
   * Manejar cambio en categoría
   */
  onCategoriaChange() {
    this.aplicarFiltros();
  }

  /**
   * Manejar cambio en energía lunar
   */
  onEnergiaLunarChange() {
    this.aplicarFiltros();
  }

  /**
   * Manejar cambio en precio
   */
  onPrecioChange() {
    this.aplicarFiltros();
  }

  /**
   * Manejar cambio en ordenamiento
   */
  onSortChange() {
    this.aplicarFiltros();
  }

  /**
   * Limpiar todos los filtros
   */
  limpiarFiltros() {
    this.terminoBusqueda = '';
    this.categoriaSeleccionada = '';
    this.energiaLunarSeleccionada = '';
    this.precioMin = undefined;
    this.precioMax = undefined;
    this.sortBy = '';
    
    this.filteredProducts = [...this.allProducts];
    this.paginaActual = 1;
  }

  /**
   * Cambiar modo de vista
   */
  cambiarVista(modo: 'grid' | 'list') {
    this.viewMode = modo;
  }

  /**
   * Obtener productos de la página actual (paginación simple del lado del cliente)
   */
  get productosPaginados(): Producto[] {
    const inicio = (this.paginaActual - 1) * this.productosPorPagina;
    const fin = inicio + this.productosPorPagina;
    return this.filteredProducts.slice(inicio, fin);
  }

  /**
   * Obtener número total de páginas
   */
  get totalPaginas(): number {
    return Math.ceil(this.filteredProducts.length / this.productosPorPagina);
  }

  /**
   * Cambiar página
   */
  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
      // Scroll al inicio de la lista
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  /**
   * Obtener array de números de página para mostrar
   */
  get paginasArray(): number[] {
    const paginas = [];
    const maxPaginas = 5; // Mostrar máximo 5 números de página
    let inicio = Math.max(1, this.paginaActual - 2);
    let fin = Math.min(this.totalPaginas, inicio + maxPaginas - 1);
    
    // Ajustar inicio si estamos cerca del final
    if (fin - inicio < maxPaginas - 1) {
      inicio = Math.max(1, fin - maxPaginas + 1);
    }
    
    for (let i = inicio; i <= fin; i++) {
      paginas.push(i);
    }
    
    return paginas;
  }

  /**
   * Extraer energías lunares únicas de los productos
   */
  private extraerEnergiasLunares(productos: Producto[]): string[] {
    const energias = productos
      .map(p => p.energiaLunar)
      .filter(e => e !== undefined && e !== null && e !== '') as string[];
    
    return [...new Set(energias)].sort();
  }

  /**
   * Obtener rango de productos mostrados
   */
  get rangoProductos(): string {
    if (this.filteredProducts.length === 0) return '0 productos';
    
    const inicio = (this.paginaActual - 1) * this.productosPorPagina + 1;
    const fin = Math.min(this.paginaActual * this.productosPorPagina, this.filteredProducts.length);
    
    return `${inicio}-${fin} de ${this.filteredProducts.length} productos`;
  }
}