import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./componentes/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'products',
    loadComponent: () => import('./componentes/producto/listar-producto/product-list.component').then(m => m.ProductListComponent)
  },
  {
    path: 'products/:id',
    loadComponent: () => import('./componentes/producto/detalle-producto/product-detail.component').then(m => m.ProductDetailComponent)
  },
  {
    path: 'cart',
    loadComponent: () => import('./componentes/carrito/cart.component').then(m => m.CartComponent)
  },
  {
    path: 'auth/login',
    loadComponent: () => import('./componentes/autenticacion/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'auth/register',
    loadComponent: () => import('./componentes/autenticacion/registro/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'checkout',
    loadComponent: () => import('./componentes/checkout/checkout.component').then(m => m.CheckoutComponent)
  },
  {
    path: 'profile',
    loadComponent: () => import('./componentes/perfil/perfil/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: 'profile/orders',
    loadComponent: () => import('./componentes/perfil/pedidos/orders.component').then(m => m.OrdersComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
