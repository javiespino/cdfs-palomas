import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NoticiasService } from '../../../core/services/noticias';
import { Noticia } from '../../../core/models/noticia';
import { environment } from '../../../../enviroment/enviroment';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-noticias',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './noticias.html',
  styleUrl: './noticias.css'
})
export class Noticias implements OnInit {
  noticias = signal<Noticia[]>([]);
  noticiaSeleccionada = signal<Noticia | null>(null);
  cargando = signal(true);
  mediaUrl = environment.mediaUrl;

  constructor(
    private noticiasService: NoticiasService,
    private title: Title
  ) {}

  ngOnInit() {
    this.title.setTitle('Noticias - CDFS Palomas');
    this.noticiasService.getNoticias().subscribe({
      next: (data) => {
        this.noticias.set(data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }

  abrirNoticia(noticia: Noticia) {
    this.noticiaSeleccionada.set(noticia);
  }

  cerrarNoticia() {
    this.noticiaSeleccionada.set(null);
  }

  extracto(contenido: string) {
    return contenido.length > 200 ? contenido.substring(0, 200) + '...' : contenido;
  }
}