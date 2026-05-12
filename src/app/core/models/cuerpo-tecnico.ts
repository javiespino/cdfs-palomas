export interface CuerpoTecnico {
  id: number;
  nombre: string;
  apellidos: string;
  cargo: string;
  foto?: string;
  idTemporada?: number;
  categoria?: string;
}