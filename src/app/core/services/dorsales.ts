import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../enviroment/enviroment';

@Injectable({ providedIn: 'root' })
export class DorsalesService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getPorTemporada(idTemporada: number) {
    return this.http.get<any[]>(`${this.apiUrl}/dorsales/temporada/${idTemporada}`);
  }

  crear(dto: { idJugador: number; idTemporada: number; dorsalNumero: number }) {
    return this.http.post(`${this.apiUrl}/dorsales`, dto);
  }

  editar(id: number, dto: { idJugador: number; idTemporada: number; dorsalNumero: number }) {
    return this.http.put(`${this.apiUrl}/dorsales/${id}`, dto);
  }

  eliminar(id: number) {
    return this.http.delete(`${this.apiUrl}/dorsales/${id}`);
  }
}