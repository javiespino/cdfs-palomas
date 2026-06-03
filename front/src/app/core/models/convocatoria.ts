export interface Convocatoria {
  id: number;
  idJugador: number;
  nombreJugador: string;
  apellidosJugador: string;
  fotoJugador?: string;
  titular: boolean;
  goles: number;
  amarillas: number;
  dobleAmarilla: boolean;
  roja: boolean;
}