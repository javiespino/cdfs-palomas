import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Partido, CrearPartido } from '../models/partido';
import { environment } from '../../../enviroment/enviroment';
import { Resumen } from '../models/resumen';

@Injectable({ providedIn: 'root' })
export class PartidosService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getResumen(idTemporada?: number, idCompeticion?: number) {
    let params = new HttpParams();
    if (idTemporada) params = params.set('idTemporada', idTemporada);
    if (idCompeticion) params = params.set('idCompeticion', idCompeticion);
    return this.http.get<Resumen>(`${this.apiUrl}/partidos/resumen`, { params });
  }

  getPartidos(idTemporada?: number, categoria?: string) {
    let params = new HttpParams();
    if (idTemporada) params = params.set('idTemporada', idTemporada);
    if (categoria) params = params.set('categoria', categoria);
    return this.http.get<Partido[]>(`${this.apiUrl}/partidos`, { params });
  }

  crear(partido: CrearPartido) {
    return this.http.post<Partido>(`${this.apiUrl}/partidos`, partido);
  }

  editar(id: number, partido: CrearPartido) {
    return this.http.put(`${this.apiUrl}/partidos/${id}`, partido);
  }

  eliminar(id: number) {
    return this.http.delete(`${this.apiUrl}/partidos/${id}`);
  }

  getResumenJugadores(idTemporada?: number, idCompeticion?: number) {
    let params = new HttpParams();
    if (idTemporada) params = params.set('idTemporada', idTemporada);
    if (idCompeticion) params = params.set('idCompeticion', idCompeticion);
    return this.http.get<any>(`${this.apiUrl}/partidos/resumen/jugadores`, { params });
  }

  getProximos() {
    return this.http.get<any[]>(`${this.apiUrl}/partidos/proximos`);
  }

  getDetalle(id: number) {
    return this.http.get<any>(`${this.apiUrl}/partidos/${id}/detalle`);
  }
}