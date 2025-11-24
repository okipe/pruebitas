// Modelo de Producto
export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  descripcion: string;
  imagen: string;
  imagenes?: string[];
  categoria: string;
  especificaciones?: string;
  material?: string;
}
