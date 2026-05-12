import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../enviroment/enviroment';

export interface CuerpoTecnicoPersona {
  id: number;
  nombre: string;
  apellidos: string;
  foto?: string;
}

export interface CuerpoTecnicoAsignacion {
  id: number;
  idCuerpoTecnico: number;
  nombreCompleto: string;
  foto?: string;
  idTemporada: number;
  nombreTemporada: string;
  categoria: string;
  cargo: string;
}

@Injectable({ providedIn: 'root' })
export class CuerpoTecnicoService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getPersonas() {
    return this.http.get<CuerpoTecnicoPersona[]>(`${this.apiUrl}/cuerpoTecnico`);
  }

  getAsignaciones(idTemporada?: number, categoria?: string) {
    let params = new HttpParams();
    if (idTemporada) params = params.set('idTemporada', idTemporada);
    if (categoria) params = params.set('categoria', categoria);
    return this.http.get<CuerpoTecnicoAsignacion[]>(`${this.apiUrl}/cuerpoTecnico/asignaciones`, { params });
  }

  crearPersona(formData: FormData) {
    return this.http.post<CuerpoTecnicoPersona>(`${this.apiUrl}/cuerpoTecnico`, formData);
  }

  editarPersona(id: number, formData: FormData) {
    return this.http.put(`${this.apiUrl}/cuerpoTecnico/${id}`, formData);
  }

  eliminarPersona(id: number) {
    return this.http.delete(`${this.apiUrl}/cuerpoTecnico/${id}`);
  }

  crearAsignacion(dto: { idCuerpoTecnico: number; idTemporada: number; categoria: string; cargo: string }) {
    return this.http.post(`${this.apiUrl}/cuerpoTecnico/asignaciones`, dto);
  }

  eliminarAsignacion(id: number) {
    return this.http.delete(`${this.apiUrl}/cuerpoTecnico/asignaciones/${id}`);
  }
}