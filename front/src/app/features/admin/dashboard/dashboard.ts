import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  nombre = localStorage.getItem('nombre') ?? 'Admin';

  constructor(
    private auth: AuthService, private router: Router,
    private title: Title
  ) {}

  ngOnInit() {
    this.title.setTitle('Panel de Control - CDFS Palomas');
  }

  logout() {
    this.auth.logout();
  }

  navegar(ruta: string) {
    this.router.navigate(['/admin/' + ruta]);
  }
}