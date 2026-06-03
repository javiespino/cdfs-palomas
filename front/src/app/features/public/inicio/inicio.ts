import { Component, OnInit, signal } from '@angular/core';
import { RouterLink} from '@angular/router';
import { DatePipe as DatePipeCommon } from '@angular/common';
import { NoticiasService } from '../../../core/services/noticias';
import { PartidosService } from '../../../core/services/partidos';
import { Noticia } from '../../../core/models/noticia';
import { environment } from '../../../../enviroment/enviroment';
import { Jugador } from '../../../core/models/jugador';
import { JugadoresService } from '../../../core/services/jugadores';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterLink, DatePipeCommon],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css'
})
export class Inicio implements OnInit {
  noticias = signal<Noticia[]>([]);
  proximosPartidos = signal<any[]>([]);
  noticiaSeleccionada = signal<Noticia | null>(null);
  mediaUrl = environment.mediaUrl;
  jugadoresAleatorios = signal<Jugador[]>([]);

  constructor(
    private noticiasService: NoticiasService,
    private partidosService: PartidosService,
    private jugadoresService: JugadoresService,
    private title: Title
  ) {}

  ngOnInit() {
      this.title.setTitle('Inicio - CDFS Palomas');
    this.noticiasService.getNoticias().subscribe({
      next: (data) => this.noticias.set(data.slice(0, 2))
    });

    this.partidosService.getProximos().subscribe({
      next: (data) => this.proximosPartidos.set(data)
    });

    this.jugadoresService.getAleatorios().subscribe({
      next: (data) => this.jugadoresAleatorios.set(data)
    });
  }

  abrirNoticia(noticia: Noticia) {
    this.noticiaSeleccionada.set(noticia);
  }

  cerrarNoticia() {
    this.noticiaSeleccionada.set(null);
  }
  
}