export interface Noticia {
  id: number;
  titulo: string;
  contenido: string;
  imagen?: string;
  idUsuario: number;
  nombreUsuario: string;
  createdAt: string;
}