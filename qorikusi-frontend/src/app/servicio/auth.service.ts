import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';
import { Usuario } from '../modelos/Usuario';
import { 
  LoginRequest, 
  RegisterClientRequest, 
  ForgotPasswordRequest,
  ResetPasswordRequest 
} from '../modelos/auth-requests';
import { LoginResponse, ErrorResponse } from '../modelos/auth-responses';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = environment.apiUrl;
  private currentUserSubject: BehaviorSubject<Usuario | null>;
  public currentUser: Observable<Usuario | null>;

  constructor(private http: HttpClient) {
    const storedUser = this.getStoredUser();
    this.currentUserSubject = new BehaviorSubject<Usuario | null>(storedUser);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  // Getter para obtener el usuario actual
  public get currentUserValue(): Usuario | null {
    return this.currentUserSubject.value;
  }

  /**
   * Login de usuario (cliente o administrador)
   */
  login(usuarioOCorreo: string, contrasenia: string): Observable<Usuario> {
    const loginRequest: LoginRequest = { usuarioOCorreo, contrasenia };

    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, loginRequest)
      .pipe(
        map(response => {
          const usuario: Usuario = {
            email: usuarioOCorreo,
            token: response.accessToken,
            roles: response.roles as string[]
          };
          
          // Guardar usuario y token
          this.storeUser(usuario);
          this.storeToken(response.accessToken);
          this.currentUserSubject.next(usuario);
          
          return usuario;
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Registro de cliente
   */
  registerClient(correo: string, contrasenia: string): Observable<void> {
    const registerRequest: RegisterClientRequest = { correo, contrasenia };

    return this.http.post<void>(`${this.apiUrl}/register/client`, registerRequest)
      .pipe(
        tap(() => console.log('Cliente registrado exitosamente')),
        catchError(this.handleError)
      );
  }

  /**
   * Recuperar contraseña
   */
  forgotPassword(correo: string): Observable<void> {
    const request: ForgotPasswordRequest = { correo };

    return this.http.post<void>(`${this.apiUrl}/forgot-password`, request)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Restablecer contraseña
   */
  resetPassword(token: string, nuevaContrasenia: string): Observable<void> {
    const request: ResetPasswordRequest = { nuevaContrasenia };

    return this.http.post<void>(`${this.apiUrl}/reset-password?token=${token}`, request)
      .pipe(
        catchError(this.handleError)
      );
  }

  /**
   * Cerrar sesión
   */
  logout(): void {
    localStorage.removeItem('usuario');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  /**
   * Verificar si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * Obtener el token JWT almacenado
   */
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  /**
   * Verificar si el usuario tiene un rol específico
   */
  hasRole(role: string): boolean {
    const user = this.currentUserValue;
    return user?.roles?.includes(role) ?? false;
  }

  // ========== MÉTODOS PRIVADOS ==========

  private storeUser(usuario: Usuario): void {
    localStorage.setItem('usuario', JSON.stringify(usuario));
  }

  private storeToken(token: string): void {
    localStorage.setItem('token', token);
  }

  private getStoredUser(): Usuario | null {
    const userJson = localStorage.getItem('usuario');
    if (userJson) {
      try {
        return JSON.parse(userJson);
      } catch {
        return null;
      }
    }
    return null;
  }

  /**
   * Manejo centralizado de errores HTTP
   * ACTUALIZADO con mensajes más específicos según las validaciones del backend
   */
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error desconocido';

    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      const serverError = error.error as ErrorResponse;
      
      switch (serverError?.code) {
        case 'USER_ALREADY_EXISTS':
          errorMessage = 'El usuario ya existe';
          break;
          
        case 'EMAIL_ALREADY_EXISTS':
          errorMessage = 'El correo electrónico ya está registrado';
          break;
          
        case 'CLIENT_NOT_FOUND':
          errorMessage = 'No se encontró una cuenta con ese correo electrónico';
          break;
          
        case 'INVALID_CREDENTIALS':
          errorMessage = 'Usuario/correo o contraseña incorrectos. Por favor verifica tus datos.';
          break;
          
        case 'CREDENTIALS_DISABLED':
          errorMessage = 'Tu cuenta ha sido deshabilitada. Por favor contacta al administrador.';
          break;
          
        case 'INVALID_TOKEN':
        case 'INVALID_TOKEN_SIGNATURE':
          errorMessage = 'El token es inválido. Por favor solicita uno nuevo.';
          break;
          
        case 'TOKEN_EXPIRED':
          errorMessage = 'El token ha expirado. Por favor solicita uno nuevo.';
          break;
          
        case 'INVALID_REQUEST':
          // Este código se usa cuando fallan las validaciones del backend
          errorMessage = 'Verifica que el formato de usuario o correo sea correcto. Los usuarios deben tener entre 7-50 caracteres y los correos deben tener un formato válido.';
          break;
          
        case 'INTERNAL_ERROR':
          errorMessage = 'Error interno del servidor. Por favor intenta más tarde.';
          break;
          
        default:
          // Si hay un mensaje específico del servidor, mostrarlo
          if (serverError?.code) {
            errorMessage = `Error: ${serverError.code}`;
          } else {
            errorMessage = `Error del servidor (${error.status})`;
          }
      }
    }

    console.error('Error en AuthService:', errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}