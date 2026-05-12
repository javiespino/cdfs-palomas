export interface Jugador {
  id: number;
  nombre: string;
  apellidos: string;
  posicion?: string;
  foto?: string;
  activo: boolean;
  dorsal?: number;
}