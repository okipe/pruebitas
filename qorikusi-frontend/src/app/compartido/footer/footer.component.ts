import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  emailNewsletter: string = '';

  onSubscribe() {
    if (this.emailNewsletter) {
      console.log('Email suscrito:', this.emailNewsletter);
      // Aquí conectarás con tu backend después
      alert('¡Gracias por suscribirte a nuestro newsletter!');
      this.emailNewsletter = '';
    }
  }
}