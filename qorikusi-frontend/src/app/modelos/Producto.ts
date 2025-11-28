// Modelo de Producto que coincide con la respuesta del backend
export interface Producto {
  uuidProducto: string;
  categoria: string;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  energiaLunar?: string;
  imagen: string;
  imagenes?: string[]; // Para el frontend (galería de imágenes)
}

// Modelo para la respuesta paginada del backend
export interface PageResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      sorted: boolean;
      unsorted: boolean;
      empty: boolean;
    };
    offset: number;
    paged: boolean;
    unpaged: boolean;
  };
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: {
    sorted: boolean;
    unsorted: boolean;
    empty: boolean;
  };
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}

// Modelo para crear/actualizar productos (Admin)
export interface ProductoRequest {
  categoria: number; // ID de categoría (no el nombre)
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  energiaLunar?: string;
  imagen: string;
}

// Modelo para la respuesta del admin (incluye estado)
export interface ProductoAdminResponse extends Producto {
  estado: boolean; // true = activo, false = inactivo
}
