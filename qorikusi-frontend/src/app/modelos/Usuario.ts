// Modelo de Usuario
export interface Usuario {
  id?: number;
  nombre?: string;
  apellido?: string;
  email: string;
  telefono?: string;
  roles?: string[];
  token?: string;
}