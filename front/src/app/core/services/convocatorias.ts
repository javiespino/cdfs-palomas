import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../enviroment/enviroment';
import { Convocatoria } from '../models/convocatoria';

@Injectable({ providedIn: 'root' })
export class ConvocatoriasService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getPorPartido(idPartido: number) {
    return this.http.get<Convocatoria[]>(`${this.apiUrl}/convocatorias/partido/${idPartido}`);
  }

  añadir(idPartido: number, idJugador: number) {
    return this.http.post(`${this.apiUrl}/convocatorias/partido/${idPartido}`, { idJugador });
  }

  quitar(id: number) {
    return this.http.delete(`${this.apiUrl}/convocatorias/${id}`);
  }

  actualizarEstadisticas(idPartido: number, estadisticas: any[]) {
    return this.http.put(`${this.apiUrl}/convocatorias/estadisticas/${idPartido}`, estadisticas);
  }
}