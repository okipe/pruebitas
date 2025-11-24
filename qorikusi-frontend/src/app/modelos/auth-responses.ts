// Respuestas de autenticación
export interface LoginResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  roles: string[];
}

export interface ErrorResponse {
  status: number;
  code: string;
  timestamp: string;
}