import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { map, catchError, tap, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';
import { Producto, PageResponse, ProductoRequest, ProductoAdminResponse, convertirProductoAdmin } from '../modelos/Producto';
import { CategoriaService } from './categoria.service';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private apiUrl = `${environment.apiProductsUrl}/catalog/products`;
  
  // Cache local de productos para búsqueda y filtrado del lado del cliente
  private productosCache$ = new BehaviorSubject<Producto[]>([]);
  
  // Cache de categorías para evitar llamadas repetidas
  private categoriasCache: { id: number, nombre: string }[] = [];
  
  constructor(
    private http: HttpClient,
    private categoriaService: CategoriaService
  ) { 
    // Cargar categorías al inicio
    this.cargarCategorias();
  }

  /**
   * Cargar categorías en cache
   */
  private cargarCategorias(): void {
    this.categoriaService.obtenerCategorias().subscribe({
      next: (categorias) => {
        this.categoriasCache = categorias.map(c => ({
          id: typeof c.idCategoria === 'string' ? parseInt(c.idCategoria, 10) : c.idCategoria,
          nombre: c.nombre
        }));
        console.log('Categorías cargadas en cache:', this.categoriasCache);
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
      }
    });
  }

  /**
   * Obtener ID de categoría por nombre
   */
  private obtenerIdCategoriaPorNombre(nombreCategoria: string): Observable<number> {
    // Si ya está en cache, devolverlo inmediatamente
    const categoriaEnCache = this.categoriasCache.find(
      c => c.nombre.toLowerCase() === nombreCategoria.toLowerCase()
    );
    
    if (categoriaEnCache) {
      return of(categoriaEnCache.id);
    }
    
    // Si no está en cache, obtener desde el servicio
    return this.categoriaService.obtenerCategorias().pipe(
      map(categorias => {
        const categoria = categorias.find(
          c => c.nombre.toLowerCase() === nombreCategoria.toLowerCase()
        );
        
        if (!categoria) {
          throw new Error(`Categoría "${nombreCategoria}" no encontrada`);
        }
        
        const id = typeof categoria.idCategoria === 'string' 
          ? parseInt(categoria.idCategoria, 10) 
          : categoria.idCategoria;
        
        // Actualizar cache
        this.categoriasCache.push({ id, nombre: categoria.nombre });
        
        return id;
      })
    );
  }

  /**
   * Obtener todos los productos del catálogo (activos)
   */
  obtenerProductos(categoria?: string): Observable<Producto[]> {
    let params = new HttpParams()
      .set('size', '1000')
      .set('page', '0');

    if (categoria) {
      params = params.set('categoria', categoria);
    }

    return this.http.get<PageResponse<Producto>>(this.apiUrl, { params })
      .pipe(
        map(response => response.content),
        tap(productos => {
          this.productosCache$.next(productos);
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Obtener productos con paginación real del backend
   */
  obtenerProductosPaginados(page: number = 0, size: number = 12, categoria?: string): Observable<PageResponse<Producto>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (categoria) {
      params = params.set('categoria', categoria);
    }

    return this.http.get<PageResponse<Producto>>(this.apiUrl, { params })
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Obtener un producto por su UUID
   */
  obtenerProductoPorId(uuid: string): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/${uuid}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * 📋 Obtener un producto por su UUID desde el endpoint de admin
   */
  obtenerProductoPorIdAdmin(uuid: string): Observable<ProductoAdminResponse> {
    const url = `${environment.apiProductsUrl}/admin/products/${uuid}`;
    return this.http.get<any>(url)
      .pipe(
        map(producto => convertirProductoAdmin(producto)),
        catchError(this.handleError)
      );
  }

  // ========== MÉTODOS DE FILTRADO (Del lado del cliente) ==========

  buscarProductos(termino: string, productos: Producto[]): Producto[] {
    if (!termino || termino.trim() === '') {
      return productos;
    }

    const terminoLower = termino.toLowerCase().trim();
    
    return productos.filter(producto =>
      producto.nombre.toLowerCase().includes(terminoLower) ||
      producto.descripcion.toLowerCase().includes(terminoLower) ||
      producto.categoria.toLowerCase().includes(terminoLower)
    );
  }

  filtrarPorCategoria(productos: Producto[], categoria: string): Producto[] {
    if (!categoria || categoria === '') {
      return productos;
    }
    
    return productos.filter(p => 
      p.categoria.toLowerCase() === categoria.toLowerCase()
    );
  }

  filtrarPorPrecio(productos: Producto[], precioMin?: number, precioMax?: number): Producto[] {
    let resultado = [...productos];

    if (precioMin !== undefined && precioMin !== null) {
      resultado = resultado.filter(p => p.precio >= precioMin);
    }

    if (precioMax !== undefined && precioMax !== null) {
      resultado = resultado.filter(p => p.precio <= precioMax);
    }

    return resultado;
  }

  filtrarPorEnergiaLunar(productos: Producto[], energia: string): Producto[] {
    if (!energia || energia === '') {
      return productos;
    }
    
    return productos.filter(p => 
      p.energiaLunar?.toLowerCase() === energia.toLowerCase()
    );
  }

  ordenarProductos(productos: Producto[], criterio: string): Producto[] {
    const productosCopia = [...productos];

    switch (criterio) {
      case 'price-asc':
        return productosCopia.sort((a, b) => a.precio - b.precio);
      
      case 'price-desc':
        return productosCopia.sort((a, b) => b.precio - a.precio);
      
      case 'name-asc':
        return productosCopia.sort((a, b) => 
          a.nombre.localeCompare(b.nombre)
        );
      
      case 'name-desc':
        return productosCopia.sort((a, b) => 
          b.nombre.localeCompare(a.nombre)
        );
      
      default:
        return productosCopia;
    }
  }

  aplicarFiltrosYOrdenamiento(
    productos: Producto[],
    filtros: {
      busqueda?: string;
      categoria?: string;
      precioMin?: number;
      precioMax?: number;
      energiaLunar?: string;
      ordenamiento?: string;
    }
  ): Producto[] {
    let resultado = [...productos];

    if (filtros.busqueda) {
      resultado = this.buscarProductos(filtros.busqueda, resultado);
    }

    if (filtros.categoria) {
      resultado = this.filtrarPorCategoria(resultado, filtros.categoria);
    }

    if (filtros.precioMin !== undefined || filtros.precioMax !== undefined) {
      resultado = this.filtrarPorPrecio(resultado, filtros.precioMin, filtros.precioMax);
    }

    if (filtros.energiaLunar) {
      resultado = this.filtrarPorEnergiaLunar(resultado, filtros.energiaLunar);
    }

    if (filtros.ordenamiento) {
      resultado = this.ordenarProductos(resultado, filtros.ordenamiento);
    }

    return resultado;
  }

  obtenerProductosCache(): Observable<Producto[]> {
    return this.productosCache$.asObservable();
  }

  // ====================================
  // MÉTODOS DE ADMINISTRACIÓN (CRUD)
  // ====================================

  /**
   * 📝 Crear un nuevo producto
   */
  crearProducto(producto: ProductoRequest): Observable<Producto> {
    const url = `${environment.apiProductsUrl}/admin/products`;
    return this.http.post<Producto>(url, producto).pipe(
      tap(() => {
        this.productosCache$.next([]);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * ✏️ Actualizar un producto existente
   */
  actualizarProducto(uuid: string, producto: ProductoRequest): Observable<Producto> {
    const url = `${environment.apiProductsUrl}/admin/products/${uuid}`;
    return this.http.patch<Producto>(url, producto).pipe(
      tap(() => {
        this.productosCache$.next([]);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * 🗑️ Eliminar un producto (cambiar estado a inactivo)
   */
  eliminarProducto(uuid: string): Observable<void> {
    const url = `${environment.apiProductsUrl}/admin/products/${uuid}`;
    console.log('🗑️ Eliminando producto:', uuid);
    return this.http.delete<void>(url).pipe(
      tap(() => {
        console.log('✅ Producto eliminado exitosamente');
        this.productosCache$.next([]);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * 🔄 NUEVO MÉTODO: Actualizar solo el estado de un producto
   * Usa endpoints específicos según el nuevo estado:
   * - Si nuevoEstado = false → DELETE /admin/products/{uuid} (desactivar)
   * - Si nuevoEstado = true → PATCH /admin/products/{uuid}/activate (activar)
   */
  actualizarEstadoProducto(uuid: string, nuevoEstado: boolean): Observable<Producto> {
    console.log(`🔄 Actualizando estado del producto ${uuid} a ${nuevoEstado}`);
    
    if (nuevoEstado === false) {
      // Desactivar producto usando el endpoint DELETE
      console.log('🗑️ Usando endpoint DELETE para desactivar');
      return this.eliminarProducto(uuid).pipe(
        switchMap(() => this.obtenerProductoPorIdAdmin(uuid)),
        tap(() => {
          console.log(`✅ Producto desactivado exitosamente`);
          this.productosCache$.next([]);
        })
      );
    } else {
      // Activar producto usando el nuevo endpoint /activate
      const url = `${environment.apiProductsUrl}/admin/products/${uuid}/activate`;
      console.log(`✅ Usando endpoint PATCH ${url} para activar`);
      
      return this.http.patch<any>(url, {}).pipe(
        map(response => {
          console.log(`✅ Respuesta del backend:`, response);
          return convertirProductoAdmin(response);
        }),
        tap(() => {
          console.log(`✅ Producto activado exitosamente`);
          this.productosCache$.next([]);
        }),
        catchError(error => {
          console.error(`❌ Error al activar producto:`, error);
          return throwError(() => error);
        })
      );
    }
  }

  /**
   * 📦 Actualizar stock de un producto
   */
  actualizarStock(uuid: string, nuevoStock: number): Observable<Producto> {
    return this.obtenerProductoPorIdAdmin(uuid).pipe(
      switchMap(producto => {
        return this.obtenerIdCategoriaPorNombre(producto.categoria).pipe(
          map(categoriaId => ({
            categoria: categoriaId,
            nombre: producto.nombre,
            descripcion: producto.descripcion,
            precio: producto.precio,
            stock: nuevoStock,
            energiaLunar: producto.energiaLunar,
            imagen: producto.imagen
          }))
        );
      }),
      switchMap(updateRequest => {
        const url = `${environment.apiProductsUrl}/admin/products/${uuid}`;
        return this.http.patch<Producto>(url, updateRequest);
      }),
      tap(() => {
        this.productosCache$.next([]);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * 📋 Obtener todos los productos para administración
   * CORREGIDO: Convierte el campo estado de string a boolean
   */
  obtenerProductosAdmin(page: number = 0, size: number = 1000): Observable<PageResponse<ProductoAdminResponse>> {
    const url = `${environment.apiProductsUrl}/admin/products`;
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    console.log('📦 Obteniendo productos admin desde:', url);
    
    return this.http.get<PageResponse<any>>(url, { params }).pipe(
      map(response => {
        console.log('📦 Respuesta del backend:', response);
        
        const productosConvertidos = response.content.map((producto: any) => {
          const productoConvertido = convertirProductoAdmin(producto);
          console.log(`Producto ${producto.nombre}: estado="${producto.estado}" → boolean=${productoConvertido.estado}`);
          return productoConvertido;
        });
        
        return {
          ...response,
          content: productosConvertidos
        };
      }),
      catchError(this.handleError)
    );
  }

  /**
   * ⚠️ Manejo de errores HTTP
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error al procesar la solicitud';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      const serverError = error.error;
      
      switch (serverError?.code) {
        case 'PRODUCT_NOT_FOUND':
          errorMessage = 'Producto no encontrado';
          break;
        
        case 'CATEGORY_NOT_FOUND':
          errorMessage = 'Categoría no encontrada';
          break;
        
        case 'INVALID_TOKEN':
          errorMessage = 'Sesión expirada. Por favor inicia sesión nuevamente';
          break;
        
        case 'INTERNAL_ERROR':
          errorMessage = 'Error interno del servidor. Por favor intenta más tarde';
          break;
        
        default:
          if (serverError?.code) {
            errorMessage = `Error: ${serverError.code}`;
          } else {
            errorMessage = `Error del servidor (${error.status})`;
          }
      }
    }

    console.error('❌ Error en ProductoService:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}