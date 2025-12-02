import { HttpInterceptorFn } from '@angular/common/http';

/**
 * HTTP Interceptor para agregar el token JWT a las peticiones
 * 
 * Este interceptor agrega automáticamente el header Authorization con el token
 * a TODAS las peticiones protegidas
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Obtener el token del localStorage
  const token = localStorage.getItem('token');
  
  // Lista de patrones de URL que NO deben llevar token (públicos)
  const isPublic = 
    req.url.includes('/auth/login') ||
    req.url.includes('/auth/register') ||
    req.url.includes('/auth/forgot-password') ||
    req.url.includes('/catalog/');  // Solo catálogo público
  
  // Si la ruta es pública, NO agregar token
  if (isPublic) {
    console.log('🌍 Ruta pública (sin token):', req.url);
    return next(req);
  }
  
  // Para TODAS las demás rutas, si hay token, agregarlo
  if (token) {
    console.log('🔒 Agregando token a la petición:', req.url);
    
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return next(clonedReq);
  }
  
  // Si no hay token en una ruta protegida
  console.log('⚠️ Petición sin token:', req.url);
  return next(req);
};