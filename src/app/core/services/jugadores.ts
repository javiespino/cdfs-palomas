import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../enviroment/enviroment';
import { Jugador } from '../models/jugador';
import { Estadistica } from '../models/estadistica';

@Injectable({ providedIn: 'root' })
export class JugadoresService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getJugadores() {
    return this.http.get<Jugador[]>(`${this.apiUrl}/jugadores`);
  }

  getTodos(idTemporada?: number) {
    let params = new HttpParams();
    if (idTemporada) params = params.set('idTemporada', idTemporada);
    return this.http.get<Jugador[]>(`${this.apiUrl}/jugadores/todos`, { params });
  }

  getJugador(id: number) {
    return this.http.get<Jugador>(`${this.apiUrl}/jugadores/${id}`);
  }

  filtrar(idTemporada?: number, categoria?: string) {
    let params = new HttpParams();
    if (idTemporada) params = params.set('idTemporada', idTemporada);
    if (categoria) params = params.set('categoria', categoria);
    return this.http.get<Jugador[]>(`${this.apiUrl}/jugadores/filtrar`, { params });
  }
  
  getHistorico() {
    return this.http.get<any[]>(`${this.apiUrl}/jugadores/estadisticas/historico`);
  }

  getAleatorios(cantidad: number = 3) {
    return this.http.get<Jugador[]>(`${this.apiUrl}/jugadores/aleatorios?cantidad=${cantidad}`);
  }

  getJugadoresPorTemporada(idTemporada: number) {
    return this.http.get<Jugador[]>(`${this.apiUrl}/jugadores/temporada/${idTemporada}`);
  }

  crear(jugador: FormData) {
    return this.http.post<Jugador>(`${this.apiUrl}/jugadores`, jugador);
  }

  editar(id: number, jugador: FormData) {
    return this.http.put<Jugador>(`${this.apiUrl}/jugadores/${id}`, jugador);
  }

  eliminar(id: number) {
    return this.http.delete(`${this.apiUrl}/jugadores/${id}`);
  }
  
  getEstadisticas(idTemporada?: number, categoria?: string, idCompeticion?: number) {
    let params = new HttpParams();
    if (idTemporada) params = params.set('idTemporada', idTemporada);
    if (categoria) params = params.set('categoria', categoria);
    if (idCompeticion) params = params.set('idCompeticion', idCompeticion);
    return this.http.get<Estadistica[]>(`${this.apiUrl}/jugadores/estadisticas`, { params });
  }
}