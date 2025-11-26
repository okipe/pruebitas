// Modelo completo de Cliente
export interface Cliente {
  idPersona?: number;
  nombres: string;
  apellidos: string;
  telefono: string;
  correo: string;
  puntosFidelidad?: number;
  signoZodiacal?: string;
  faseLunarPreferida?: string;
  fechaRegistro?: string;
  estado?: boolean;
}

// Request para actualizar datos del cliente
export interface UpdateClientDataRequest {
  nombres?: string;
  apellidos?: string;
  telefono?: string;
  puntos?: number;
  signoZodiacal?: string;
  faseLunarPreferida?: string;
}

// Response al actualizar datos del cliente
export interface UpdateClientDataResponse {
  nombres: string;
  apellidos: string;
  telefono: string;
  puntos: number;
  signoZodiacal?: string;
  faseLunarPreferida?: string;
}

// Response al obtener datos del cliente
export interface RetrieveClientDataResponse {
  nombres: string;
  apellidos: string;
  telefono: string;
  puntos: number;
  signoZodiacal?: string;
  faseLunarPreferida?: string;
}