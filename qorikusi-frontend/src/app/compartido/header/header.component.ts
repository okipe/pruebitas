import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../servicio/auth.service';
import { Subscription } from 'rxjs';
import { Usuario } from '../../modelos/Usuario';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
  menuOpen = false;
  userMenuOpen = false;
  guestMenuOpen = false; // ← NUEVO: para el menú de invitados
  cartItemsCount = 0;
  
  // Usuario autenticado
  currentUser: Usuario | null = null;
  isAuthenticated = false;
  private userSubscription?: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Suscribirse a cambios en el usuario autenticado
    this.userSubscription = this.authService.currentUser.subscribe(user => {
      this.currentUser = user;
      this.isAuthenticated = !!user;
    });
  }

  ngOnDestroy() {
    // Limpiar suscripción
    this.userSubscription?.unsubscribe();
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
    this.guestMenuOpen = false; // Cerrar el otro menú
  }

  closeUserMenu() {
    this.userMenuOpen = false;
  }

  // ← NUEVO: Métodos para el menú de invitados
  toggleGuestMenu() {
    this.guestMenuOpen = !this.guestMenuOpen;
    this.userMenuOpen = false; // Cerrar el otro menú
  }

  closeGuestMenu() {
    this.guestMenuOpen = false;
  }

  logout() {
    if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
      this.authService.logout();
      this.closeUserMenu();
      this.router.navigate(['/']);
    }
  }

  // Obtener iniciales del usuario
  getUserInitials(): string {
    if (this.currentUser?.nombre && this.currentUser?.apellido) {
      return `${this.currentUser.nombre.charAt(0)}${this.currentUser.apellido.charAt(0)}`.toUpperCase();
    } else if (this.currentUser?.email) {
      return this.currentUser.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  }

  // Verificar si es admin
  isAdmin(): boolean {
    return this.currentUser?.roles?.includes('ROLE_ADMIN') ?? false;
  }
}