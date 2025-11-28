import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './componentes/admin/dashboard/admin-dashboard.component';
import { ProductAdminListComponent } from './componentes/admin/products/product-admin-list.component';
import { ProductFormComponent } from './componentes/admin/product-form/product-form.component';
import { HomeComponent } from './componentes/home/home.component';
import { ProductListComponent } from './componentes/producto/listar-producto/product-list.component';
import { ProductDetailComponent } from './componentes/producto/detalle-producto/product-detail.component';
import { CartComponent } from './componentes/carrito/cart.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./componentes/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'products',
    loadComponent: () =>
      import(
        './componentes/producto/listar-producto/product-list.component'
      ).then((m) => m.ProductListComponent),
  },
  {
    path: 'products/:id',
    loadComponent: () =>
      import(
        './componentes/producto/detalle-producto/product-detail.component'
      ).then((m) => m.ProductDetailComponent),
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./componentes/carrito/cart.component').then(
        (m) => m.CartComponent
      ),
  },
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./componentes/autenticacion/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'auth/register',
    loadComponent: () =>
      import('./componentes/autenticacion/registro/register.component').then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./componentes/checkout/checkout.component').then(
        (m) => m.CheckoutComponent
      ),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./componentes/perfil/perfil/profile.component').then(
        (m) => m.ProfileComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'profile/addresses',
    loadComponent: () =>
      import('./componentes/perfil/direcciones/addresses.component').then(
        (m) => m.AddressesComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'profile/orders',
    loadComponent: () =>
      import('./componentes/perfil/pedidos/orders.component').then(
        (m) => m.OrdersComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'admin',
    children: [
      {
        path: '',
        component: AdminDashboardComponent,
      },
      {
        path: 'products',
        component: ProductAdminListComponent,
      },
      {
        path: 'products/new',
        component: ProductFormComponent,
      },
      {
        path: 'products/edit/:id',
        component: ProductFormComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
