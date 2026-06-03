import { Component, OnInit, signal } from '@angular/core';
import { PartidosService } from '../../../core/services/partidos';
import { TemporadasService } from '../../../core/services/temporadas';
import { CompeticionesService } from '../../../core/services/competiciones';
import { Resumen } from '../../../core/models/resumen';
import { Temporada } from '../../../core/models/temporada';
import { Competicion } from '../../../core/models/competicion';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-clasificacion',
  standalone: true,
  templateUrl: './clasificacion.html',
  styleUrl: './clasificacion.css'
})
export class Clasificacion implements OnInit {
  resumen = signal<Resumen | null>(null);
  temporadas = signal<Temporada[]>([]);
  competiciones = signal<Competicion[]>([]);
  temporadaSeleccionada = signal<number | null>(null);
  competicionSeleccionada = signal<number | null>(null);
  cargando = signal(true);
  error = signal('');
  Math = Math;

  constructor(
    private partidosService: PartidosService,
    private temporadasService: TemporadasService,
    private competicionesService: CompeticionesService,
    private title: Title
  ) {}

  ngOnInit() {
    this.title.setTitle('Clasificación - CDFS Palomas');
    this.temporadasService.getTemporadas().subscribe({
      next: (data) => {
        this.temporadas.set(data);
        if (data.length > 0) {
          const ultima = data[data.length - 1];
          this.temporadaSeleccionada.set(ultima.id);
          this.competicionesService.getPorTemporada(ultima.id).subscribe({
            next: (comps) => {
              this.competiciones.set(comps);
              if (comps.length > 0) {
                this.competicionSeleccionada.set(comps[0].id);
              }
              this.cargarResumen();
            }
          });
        }
      }
    });
  }

  onTemporadaChange(id: string) {
    this.temporadaSeleccionada.set(id ? parseInt(id) : null);
    this.competicionSeleccionada.set(null);
    this.competiciones.set([]);
    this.resumen.set(null);

    if (id) {
      this.competicionesService.getPorTemporada(parseInt(id)).subscribe({
        next: (data) => this.competiciones.set(data)
      });
    }
  }

  onCompeticionChange(id: string) {
    this.competicionSeleccionada.set(id ? parseInt(id) : null);
  }

  buscar() {
    this.cargarResumen();
  }

  resumenJugadores = signal<any>(null);

  cargarResumen() {
    this.cargando.set(true);
    this.partidosService.getResumen(
      this.temporadaSeleccionada() ?? undefined,
      this.competicionSeleccionada() ?? undefined
    ).subscribe({
      next: (data) => {
        this.resumen.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Error al cargar el resumen');
        this.cargando.set(false);
      }
    });

    this.partidosService.getResumenJugadores(
      this.temporadaSeleccionada() ?? undefined,
      this.competicionSeleccionada() ?? undefined
    ).subscribe({
      next: (data) => this.resumenJugadores.set(data)
    });
  }

  getPorcentajeVictorias() {
    const r = this.resumen();
    if (!r || r.totalPartidos === 0) return 0;
    return Math.round((r.ganados / r.totalPartidos) * 100);
  }

  getRachaColor() {
    const racha = this.resumen()?.rachaActual ?? '';
    if (racha.endsWith('V')) return 'racha-victoria';
    if (racha.endsWith('D')) return 'racha-derrota';
    return 'racha-empate';
  }

  
}