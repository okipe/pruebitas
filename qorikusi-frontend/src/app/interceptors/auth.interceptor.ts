import { HttpInterceptorFn } from '@angular/common/http';

/**
 * HTTP Interceptor para agregar el token JWT a las peticiones
 * 
 * Este interceptor agrega automáticamente el header Authorization con el token
 * a todas las peticiones que vayan a endpoints protegidos (/admin/ o /customer/)
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Obtener el token del localStorage
  // Nota: Ajusta 'token' si usas otra key (ej: 'auth_token', 'jwt_token', etc.)
  const token = localStorage.getItem('token');
  
  // Verificar si la petición es a un endpoint que requiere autenticación
  const requiresAuth = req.url.includes('/admin/') || 
                       req.url.includes('/customer/') ||
                       req.url.includes('/auth/profile'); // Ajusta según tus endpoints
  
  // Si hay token y la petición requiere auth, agregar el header
  if (token && requiresAuth) {
    console.log('🔒 Agregando token a la petición:', req.url);
    
    // Clonar la petición y agregar el header Authorization
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return next(clonedReq);
  }
  
  // Si no hay token o no es un endpoint protegido, continuar sin cambios
  return next(req);
};