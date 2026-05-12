export interface Partido {
  id: number;
  fecha: string;
  rival: string;
  golesFavor: number;
  golesContra: number;
  esLocal: boolean;
  idCompeticion: number;
  nombreCompeticion: string;
  categoria: string;
  nombreTemporada: string;
  jugado: boolean;
}

export interface CrearPartido {
  fecha: string;
  rival: string;
  golesFavor: number;
  golesContra: number;
  esLocal: boolean;
  idCompeticion: number;
  jugado: boolean;
}