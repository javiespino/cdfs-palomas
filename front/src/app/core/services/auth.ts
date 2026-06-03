import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { environment } from '../../../enviroment/enviroment';

export interface LoginResponse {
  token: string;
  nombre: string;
  rol: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = environment.apiUrl;
  isLoggedIn = signal<boolean>(!!localStorage.getItem('token'));

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, contrasena: string) {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, { email, contrasena }).pipe(
      tap(res => {
        sessionStorage.setItem('token', res.token);
        sessionStorage.setItem('nombre', res.nombre);
        sessionStorage.setItem('rol', res.rol);
        this.isLoggedIn.set(true);
      })
    );
  }

  logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('nombre');
    sessionStorage.removeItem('rol');
    this.isLoggedIn.set(false);
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return sessionStorage.getItem('token');
  }

  getNombre(): string | null {
    return sessionStorage.getItem('nombre');
  }

  getRol(): string | null {
    return sessionStorage.getItem('rol');
  }

  getPerfil() {
    return this.http.get<any>(`${this.apiUrl}/auth/perfil`);
  }

  actualizarPerfil(dto: { nombre: string; email: string }) {
    return this.http.put<any>(`${this.apiUrl}/auth/perfil`, dto);
  }

  cambiarContrasena(dto: { contrasenaActual: string; nuevaContrasena: string }) {
    return this.http.put(`${this.apiUrl}/auth/cambiar-contrasena`, dto);
  }
}