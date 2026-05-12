import { Component, OnInit, signal } from '@angular/core';
import { JugadoresService } from '../../../core/services/jugadores';
import { TemporadasService } from '../../../core/services/temporadas';
import { Jugador } from '../../../core/models/jugador';
import { Temporada } from '../../../core/models/temporada';
import { CuerpoTecnico } from '../../../core/models/cuerpo-tecnico';
import { environment } from '../../../../enviroment/enviroment';
import { Title } from '@angular/platform-browser';
import { CuerpoTecnicoService, CuerpoTecnicoAsignacion } from '../../../core/services/cuerpo-tecnico';

@Component({
  selector: 'app-plantilla',
  standalone: true,
  templateUrl: './plantilla.html',
  styleUrl: './plantilla.css'
})
export class Plantilla implements OnInit {
  jugadores = signal<Jugador[]>([]);
  temporadas = signal<Temporada[]>([]);
  cuerpoTecnico = signal<CuerpoTecnicoAsignacion[]>([]);
  cargando = signal(true);
  error = signal('');

  temporadaSeleccionada = signal<number | null>(null);
  categoriaSeleccionada = signal<string>('Senior');
  posicionSeleccionada = signal<string>('Todos');

  categorias = ['Senior', 'Senior Femenino', 'Juvenil', 'Cadete', 'Infantil', 'Alevín', 'Benjamín', 'Prebenjamín'];
  posiciones = ['Todos', 'Portero', 'Cierre', 'Ala', 'Pivot'];

  mediaUrl = environment.mediaUrl;

  constructor(
    private jugadoresService: JugadoresService,
    private temporadasService: TemporadasService,
    private cuerpoTecnicoService: CuerpoTecnicoService,
    private title: Title
  ) {}

  ngOnInit() {
    this.title.setTitle('Plantilla - CDFS Palomas');
    this.temporadasService.getTemporadas().subscribe({
      next: (data) => {
        this.temporadas.set(data);
        if (data.length > 0) {
          const ultima = data[data.length - 1];
          this.temporadaSeleccionada.set(ultima.id);
          this.cargarDatos();
        } else {
          this.cargando.set(false);
        }
      }
    });
  }

  cargarDatos() {
    this.cargando.set(true);
    this.jugadoresService.filtrar(
      this.temporadaSeleccionada() ?? undefined,
      this.categoriaSeleccionada() || undefined
    ).subscribe({
      next: (data) => {
        this.jugadores.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Error al cargar la plantilla');
        this.cargando.set(false);
      }
    });

    this.cuerpoTecnicoService.getAsignaciones(
      this.temporadaSeleccionada() ?? undefined,
      this.categoriaSeleccionada() || undefined
    ).subscribe({
      next: (data) => this.cuerpoTecnico.set(data)
    });
  }

  cargarJugadores() {
    this.cargarDatos();
  }

  onTemporadaChange(id: string) {
    this.temporadaSeleccionada.set(id ? parseInt(id) : null);
  }

  onCategoriaChange(cat: string) {
    this.categoriaSeleccionada.set(cat);
  }

  buscar() {
    this.cargarDatos();
  }

  jugadoresFiltrados() {
    if (this.posicionSeleccionada() === 'Todos') return this.jugadores();
    return this.jugadores().filter(j => j.posicion === this.posicionSeleccionada());
  }
}