import { Component, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { PartidosService } from '../../../core/services/partidos';
import { TemporadasService } from '../../../core/services/temporadas';
import { Partido } from '../../../core/models/partido';
import { Temporada } from '../../../core/models/temporada';
import { Title } from '@angular/platform-browser';
import { environment } from '../../../../enviroment/enviroment';

@Component({
  selector: 'app-calendario',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './calendario.html',
  styleUrl: './calendario.css'
})
export class Calendario implements OnInit {
  partidos = signal<Partido[]>([]);
  temporadas = signal<Temporada[]>([]);
  temporadaSeleccionada = signal<number | null>(null);
  categoriaSeleccionada = signal<string>('');
  cargando = signal(true);
  partidoDetalle = signal<any>(null);
  cargandoDetalle = signal(false);
  mediaUrl = environment.mediaUrl;

  categorias = ['Senior', 'Senior Femenino', 'Juvenil', 'Cadete', 'Infantil', 'Alevín', 'Benjamín', 'Prebenjamín'];

  constructor(
    private partidosService: PartidosService,
    private temporadasService: TemporadasService,
    private title: Title
  ) {}

  ngOnInit() {
    this.title.setTitle('Calendario - CDFS Palomas');
    this.temporadasService.getTemporadas().subscribe({
      next: (data) => this.temporadas.set(data)
    });
    this.cargarPartidos();
  }

  cargarPartidos() {
    this.cargando.set(true);
    this.partidosService.getPartidos(
      this.temporadaSeleccionada() ?? undefined,
      this.categoriaSeleccionada() || undefined
    ).subscribe({
      next: (data) => {
        this.partidos.set(data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }

  onTemporadaChange(id: string) {
    this.temporadaSeleccionada.set(id ? parseInt(id) : null);
    this.cargarPartidos();
  }

  onCategoriaChange(cat: string) {
    this.categoriaSeleccionada.set(cat);
    this.cargarPartidos();
  }

  proximosPartidos() {
    return this.partidos().filter(p => !p.jugado);
  }

  resultados() {
    return this.partidos().filter(p => p.jugado);
  }

  resultado(p: any) {
    return p.golesFavor > p.golesContra ? 'victoria'
      : p.golesFavor < p.golesContra ? 'derrota'
      : 'empate';
  }

  abrirDetalle(id: number) {
    this.cargandoDetalle.set(true);
    this.partidosService.getDetalle(id).subscribe({
      next: (data) => {
        this.partidoDetalle.set(data);
        this.cargandoDetalle.set(false);
      }
    });
  }

  cerrarDetalle() {
    this.partidoDetalle.set(null);
  }

  partidosPorTemporada() {
    const grupos: { temporada: string; proximos: any[]; resultados: any[] }[] = [];
    
    const temporadasUnicas = [...new Set(this.partidos().map(p => p.nombreTemporada))];
    
    temporadasUnicas.forEach(temporada => {
      const partidosTemporada = this.partidos().filter(p => p.nombreTemporada === temporada);
      grupos.push({
        temporada,
        proximos: partidosTemporada.filter(p => !p.jugado),
        resultados: partidosTemporada.filter(p => p.jugado)
      });
    });
    
    return grupos;
  }
}