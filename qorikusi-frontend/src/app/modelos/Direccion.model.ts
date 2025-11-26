// Modelo de Ubigeo
export interface Ubigeo {
  idUbigeo?: number;
  codigoUbigeo: string;
  departamento: string;
  provincia: string;
  distrito: string;
}

// Modelo de Dirección
export interface Direccion {
  idDireccion?: number;
  uuidDireccion?: string;
  calle: string;
  cliente?: string; // Nombre completo del cliente
  codigoUbigeo: string;
  departamento?: string;
  provincia?: string;
  distrito?: string;
}

// Request para crear/actualizar dirección
export interface DireccionRequest {
  calle: string;
  codigoUbigeo: string;
}

// Response de dirección
export interface DireccionResponse {
  uuidDireccion: string;
  cliente: string;
  codigoUbigeo: string;
  departamento: string;
  provincia: string;
  distrito: string;
  calle: string;
}

// Interface para selección de Ubigeo en cascada
export interface UbigeoSelect {
  departamentos: string[];
  provincias: Map<string, string[]>;
  distritos: Map<string, string[]>;
}
