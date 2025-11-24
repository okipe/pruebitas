import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Producto } from '../modelos/Producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private productos: Producto[] = [
    {
      id: 1,
      nombre: 'Collar Inti',
      precio: 180.00,
      descripcion: 'Collar de plata 925 con cuarzo natural',
      imagen: 'https://via.placeholder.com/350x350/f5f3f0/3d3d5c?text=Collar+Inti',
      imagenes: [
        'https://via.placeholder.com/500x500/f5f3f0/3d3d5c?text=Collar+Inti+1',
        'https://via.placeholder.com/500x500/f5f3f0/3d3d5c?text=Collar+Inti+2'
      ],
      categoria: 'Collares',
      especificaciones: 'Largo: 45 cm aprox',
      material: 'Plata'
    }
  ];

  constructor() { }

  obtenerProductos(): Observable<Producto[]> {
    return of(this.productos);
  }

  obtenerProductoPorId(id: number): Observable<Producto | undefined> {
    const producto = this.productos.find(p => p.id === id);
    return of(producto);
  }
}
