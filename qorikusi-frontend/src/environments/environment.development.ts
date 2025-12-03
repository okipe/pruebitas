// src/environments/environment.development.ts

export const environment = {
  production: false,
  
  // URLs de los microservicios del backend
  apiUrl: 'http://localhost:8080/auth',              // Servicio de autenticación
  apiProductsUrl: 'http://localhost:8082',           // Servicio de productos
  apiCartUrl: 'http://localhost:8083',               // Servicio de carrito
  apiCustomerUrl: 'http://localhost:8081',           // Servicio de cliente (si existe)
  
  // Configuración adicional
  defaultPageSize: 12,
  maxItemsPerProduct: 10,
  freeShippingThreshold: 250
};
