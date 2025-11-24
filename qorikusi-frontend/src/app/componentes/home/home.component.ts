import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  
  // Productos destacados (datos temporales)
  featuredProducts = [
    {
      id: 1,
      name: 'Flor de Bruma',
      price: 180.00,
      image: 'https://via.placeholder.com/300x300/f5f3f0/3d3d5c?text=Flor+de+Bruma'
    },
    {
      id: 2,
      name: 'Anillo Lunar',
      price: 200.00,
      image: 'https://via.placeholder.com/300x300/f5f3f0/3d3d5c?text=Anillo+Lunar'
    },
    {
      id: 3,
      name: 'Collar Tika',
      price: 120.00,
      image: 'https://via.placeholder.com/300x300/f5f3f0/3d3d5c?text=Collar+Tika'
    },
    {
      id: 4,
      name: 'Alma Ancestral',
      price: 250.00,
      image: 'https://via.placeholder.com/300x300/f5f3f0/3d3d5c?text=Alma+Ancestral'
    }
  ];

  // Colecciones
  collections = [
    {
      id: 1,
      name: 'ANDES SAGRADOS',
      image: 'https://via.placeholder.com/400x500/d4af37/fff?text=ANDES+SAGRADOS'
    },
    {
      id: 2,
      name: 'ALMA Y LUZ',
      image: 'https://via.placeholder.com/400x500/f5f3f0/3d3d5c?text=ALMA+Y+LUZ'
    },
    {
      id: 3,
      name: 'LUNA NUEVA',
      image: 'https://via.placeholder.com/400x500/3d3d5c/fff?text=LUNA+NUEVA'
    }
  ];

  // Testimonios
  testimonials = [
    {
      name: 'Isabel Perez',
      text: 'Cada pieza tiene una energía única. ¡Se nota que está hecha con amor y conexión lunar!',
      avatar: 'https://via.placeholder.com/80x80/3d3d5c/fff?text=IP'
    },
    {
      name: 'Isabel Perez',
      text: 'Cada pieza tiene una energía única. ¡Se nota que está hecha con amor y conexión lunar!',
      avatar: 'https://via.placeholder.com/80x80/3d3d5c/fff?text=IP'
    }
  ];

}