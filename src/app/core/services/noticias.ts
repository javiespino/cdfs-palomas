import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../enviroment/enviroment';
import { Noticia } from '../models/noticia';

@Injectable({ providedIn: 'root' })
export class NoticiasService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getNoticias() {
    return this.http.get<Noticia[]>(`${this.apiUrl}/noticias`);
  }

  getNoticia(id: number) {
    return this.http.get<Noticia>(`${this.apiUrl}/noticias/${id}`);
  }

  crear(formData: FormData) {
    return this.http.post<number>(`${this.apiUrl}/noticias`, formData);
  }

  editar(id: number, formData: FormData) {
    return this.http.put(`${this.apiUrl}/noticias/${id}`, formData);
  }

  eliminar(id: number) {
    return this.http.delete(`${this.apiUrl}/noticias/${id}`);
  }
}