import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Competicion } from '../models/competicion';
import { environment } from '../../../enviroment/enviroment';

@Injectable({ providedIn: 'root' })
export class CompeticionesService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getCompeticiones() {
    return this.http.get<Competicion[]>(`${this.apiUrl}/competiciones`);
  }

  getPorTemporada(idTemporada: number) {
    return this.http.get<Competicion[]>(`${this.apiUrl}/competiciones/temporada/${idTemporada}`);
  }

  crear(dto: { nombre: string; categoria: string; idTemporada: number }) {
    return this.http.post<Competicion>(`${this.apiUrl}/competiciones`, dto);
  }

  editar(id: number, dto: { nombre: string; categoria: string; idTemporada: number }) {
    return this.http.put(`${this.apiUrl}/competiciones/${id}`, dto);
  }

  eliminar(id: number) {
    return this.http.delete(`${this.apiUrl}/competiciones/${id}`);
  }
}