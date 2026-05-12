import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-admin-perfil',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './admin-perfil.html',
  styleUrl: './admin-perfil.css'
})
export class AdminPerfil implements OnInit {
  guardando = signal(false);
  guardandoContrasena = signal(false);
  errorPerfil = signal('');
  errorContrasena = signal('');
  exitoPerfil = signal('');
  exitoContrasena = signal('');

  perfil = {
    nombre: '',
    email: ''
  };

  contrasena = {
    actual: '',
    nueva: '',
    confirmar: ''
  };

  verActual = signal(false);
  verNueva = signal(false);

  constructor(
    private auth: AuthService,
    private title: Title
  ) {}

  ngOnInit() {
    this.title.setTitle('Perfil - CDFS Palomas');
    this.auth.getPerfil().subscribe({
      next: (data) => {
        this.perfil.nombre = data.nombre;
        this.perfil.email = data.email;
      }
    });
  }

  guardarPerfil() {
    if (!this.perfil.nombre || !this.perfil.email) {
      this.errorPerfil.set('Nombre y email son obligatorios');
      return;
    }

    this.guardando.set(true);
    this.errorPerfil.set('');
    this.exitoPerfil.set('');

    this.auth.actualizarPerfil(this.perfil).subscribe({
      next: (data) => {
        sessionStorage.setItem('nombre', data.nombre);
        this.guardando.set(false);
        this.exitoPerfil.set('Perfil actualizado correctamente');
      },
      error: (err) => {
        this.guardando.set(false);
        this.errorPerfil.set(err.error?.message ?? 'Error al actualizar el perfil');
      }
    });
  }

  guardarContrasena() {
    if (!this.contrasena.actual || !this.contrasena.nueva || !this.contrasena.confirmar) {
      this.errorContrasena.set('Rellena todos los campos');
      return;
    }

    if (this.contrasena.nueva !== this.contrasena.confirmar) {
      this.errorContrasena.set('Las contraseñas nuevas no coinciden');
      return;
    }

    if (this.contrasena.nueva.length < 6) {
      this.errorContrasena.set('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    this.guardandoContrasena.set(true);
    this.errorContrasena.set('');
    this.exitoContrasena.set('');

    this.auth.cambiarContrasena({
      contrasenaActual: this.contrasena.actual,
      nuevaContrasena: this.contrasena.nueva
    }).subscribe({
      next: () => {
        this.guardandoContrasena.set(false);
        this.exitoContrasena.set('Contraseña cambiada correctamente');
        this.contrasena = { actual: '', nueva: '', confirmar: '' };
      },
      error: (err) => {
        this.guardandoContrasena.set(false);
        this.errorContrasena.set(err.error?.message ?? 'Error al cambiar la contraseña');
      }
    });
  }
}