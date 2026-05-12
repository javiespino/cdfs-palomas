import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../enviroment/enviroment';
import { Temporada } from '../models/temporada';

@Injectable({ providedIn: 'root' })
export class TemporadasService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getTemporadas() {
    return this.http.get<Temporada[]>(`${this.apiUrl}/temporadas`);
  }

  crear(nombre: string) {
    return this.http.post<Temporada>(`${this.apiUrl}/temporadas`, { nombre });
  }

  editar(id: number, nombre: string) {
    return this.http.put(`${this.apiUrl}/temporadas/${id}`, { nombre });
  }

  eliminar(id: number) {
    return this.http.delete(`${this.apiUrl}/temporadas/${id}`);
  }
}