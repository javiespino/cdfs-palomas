import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email = '';
  contrasena = '';
  error = signal('');
  cargando = signal(false);
  verContrasena = signal(false);

  constructor(
    private auth: AuthService, 
    private router: Router,
    private title: Title
  ) {}
  
  ngOnInit() {
    this.title.setTitle('Login - CDFS Palomas');
  }

  onSubmit() {
    if (!this.email || !this.contrasena) {
      this.error.set('Rellena todos los campos');
      return;
    }
    this.cargando.set(true);
    this.error.set('');
    this.auth.login(this.email, this.contrasena).subscribe({
      next: () => {
        this.cargando.set(false);
        this.router.navigate(['/admin']);
      },
      error: () => {
        this.cargando.set(false);
        this.error.set('Email o contraseña incorrectos');
      }
    });
  }
}