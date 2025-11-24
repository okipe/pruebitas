// Solicitudes de autenticación
export interface LoginRequest {
  usuarioOCorreo: string;
  contrasenia: string;
}

export interface RegisterClientRequest {
  correo: string;
  contrasenia: string;
}

export interface RegisterAdminRequest {
  usuario: string;
  contrasenia: string;
}

export interface ForgotPasswordRequest {
  correo: string;
}

export interface ResetPasswordRequest {
  nuevaContrasenia: string;
}