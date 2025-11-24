import { ItemCarrito } from './ItemCarrito';

// Modelo de Pedido
export interface Pedido {
  id: number;
  items: ItemCarrito[];
  total: number;
  fecha: Date;
  estado: string;
  datosEnvio: DatosEnvio;
}

export interface DatosEnvio {
  nombres: string;
  apellidos: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  codigoPostal?: string;
}
