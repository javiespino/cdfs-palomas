import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/public/inicio/inicio').then(m => m.Inicio)
  },
  {
    path: 'plantilla',
    loadComponent: () =>
      import('./features/public/plantilla/plantilla').then(m => m.Plantilla)
  },
  {
    path: 'calendario',
    loadComponent: () =>
      import('./features/public/calendario/calendario').then(m => m.Calendario)
  },
  {
    path: 'clasificacion',
    loadComponent: () =>
      import('./features/public/clasificacion/clasificacion').then(m => m.Clasificacion)
  },
  {
    path: 'estadisticas',
    loadComponent: () =>
      import('./features/public/estadisticas/estadisticas').then(m => m.Estadisticas)
  },
  {
    path: 'noticias',
    loadComponent: () =>
      import('./features/public/noticias/noticias').then(m => m.Noticias)
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/admin/login/login').then(m => m.Login)
  },
  {
    path: 'pabellon',
    loadComponent: () =>
      import('./features/public/pabellon/pabellon').then(m => m.Pabellon)
  },
  {
    path: 'historia',
    loadComponent: () =>
      import('./features/public/historia/historia').then(m => m.Historia)
  },
  {
    path: 'admin',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./features/admin/dashboard/dashboard').then(m => m.Dashboard)
      },
      {
        path: 'perfil',
        loadComponent: () =>
          import('./features/admin/admin-perfil/admin-perfil').then(m => m.AdminPerfil),
      },
      {
        path: 'jugadores',
        loadComponent: () =>
          import('./features/admin/admin-jugadores/admin-jugadores').then(m => m.AdminJugadores)
      },
      {
        path: 'partidos',
        loadComponent: () =>
          import('./features/admin/admin-partidos/admin-partidos').then(m => m.AdminPartidos)
      },
      {
        path: 'noticias',
        loadComponent: () =>
          import('./features/admin/admin-noticias/admin-noticias').then(m => m.AdminNoticias)
      },
      {
        path: 'temporadas',
        loadComponent: () =>
          import('./features/admin/admin-temporadas/admin-temporadas').then(m => m.AdminTemporadas)
      },
      {
        path: 'competiciones',
        loadComponent: () =>
          import('./features/admin/admin-competiciones/admin-competiciones').then(m => m.AdminCompeticiones)
      },
      {
        path: 'cuerpo-tecnico',
        loadComponent: () =>
          import('./features/admin/admin-cuerpo-tecnico/admin-cuerpo-tecnico').then(m => m.AdminCuerpoTecnico)
      }
    ]
  },
  { path: '**', redirectTo: '' }
];