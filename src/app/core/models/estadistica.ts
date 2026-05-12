export interface Estadistica {
  id: number;
  nombre: string;
  apellidos: string;
  foto?: string;
  posicion?: string;
  jugados: number;
  titular: number;
  goles: number;
  amarillas: number;
  dobleAmarilla: number;
  rojas: number;
}