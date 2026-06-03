import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PartidosService } from '../../../core/services/partidos';
import { CompeticionesService } from '../../../core/services/competiciones';
import { TemporadasService } from '../../../core/services/temporadas';
import { AdminConvocatorias } from '../admin-convocatorias/admin-convocatorias';
import { Partido, CrearPartido } from '../../../core/models/partido';
import { Competicion } from '../../../core/models/competicion';
import { Temporada } from '../../../core/models/temporada';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-admin-partidos',
  standalone: true,
  imports: [FormsModule, DatePipe, RouterLink, AdminConvocatorias],
  templateUrl: './admin-partidos.html',
  styleUrl: './admin-partidos.css'
})
export class AdminPartidos implements OnInit {
  partidos = signal<Partido[]>([]);
  competiciones = signal<Competicion[]>([]);
  temporadas = signal<Temporada[]>([]);
  temporadaSeleccionada = signal<number | null>(null);
  cargando = signal(true);
  mostrarFormulario = signal(false);
  partidoEditando = signal<Partido | null>(null);
  partidoConvocatoria = signal<Partido | null>(null);
  guardando = signal(false);
  error = signal('');

  form: CrearPartido = {
    fecha: '',
    rival: '',
    golesFavor: 0,
    golesContra: 0,
    esLocal: true,
    idCompeticion: 0,
    jugado: false
  };

  categorias = ['Senior', 'Senior Femenino', 'Juvenil', 'Cadete', 'Infantil', 'Alevín', 'Benjamín', 'Prebenjamín'];

  constructor(
    private partidosService: PartidosService,
    private competicionesService: CompeticionesService,
    private temporadasService: TemporadasService,
    private title: Title
  ) {}

  ngOnInit() {
    this.title.setTitle('Partidos - CDFS Palomas');
    this.temporadasService.getTemporadas().subscribe({
      next: (data) => this.temporadas.set(data)
    });
    this.competicionesService.getCompeticiones().subscribe({
      next: (data) => this.competiciones.set(data)
    });
    this.cargarPartidos();
  }

  cargarPartidos() {
    this.cargando.set(true);
    this.partidosService.getPartidos(
      this.temporadaSeleccionada() ?? undefined
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
    if (id) {
      this.competicionesService.getPorTemporada(parseInt(id)).subscribe({
        next: (data) => this.competiciones.set(data)
      });
    } else {
      this.competicionesService.getCompeticiones().subscribe({
        next: (data) => this.competiciones.set(data)
      });
    }
    this.cargarPartidos();
  }

  abrirFormulario(partido?: Partido) {
    if (partido) {
      this.partidoEditando.set(partido);
      this.form = {
        fecha: partido.fecha.substring(0, 10),
        rival: partido.rival,
        golesFavor: partido.golesFavor,
        golesContra: partido.golesContra,
        esLocal: partido.esLocal,
        idCompeticion: partido.idCompeticion,
        jugado: partido.jugado
      };
    } else {
      this.partidoEditando.set(null);
      this.form = {
        fecha: '',
        rival: '',
        golesFavor: 0,
        golesContra: 0,
        esLocal: true,
        idCompeticion: this.competiciones()[0]?.id ?? 0,
        jugado: false
      };
    }
    this.error.set('');
    this.mostrarFormulario.set(true);
  }

  cerrarFormulario() {
    this.mostrarFormulario.set(false);
    this.partidoEditando.set(null);
  }

  abrirConvocatoria(partido: Partido) {
    this.partidoConvocatoria.set(partido);
  }

  cerrarConvocatoria() {
    this.partidoConvocatoria.set(null);
  }

  guardar() {
    if (!this.form.fecha || !this.form.rival || !this.form.idCompeticion) {
      this.error.set('Fecha, rival y competición son obligatorios');
      return;
    }

    this.guardando.set(true);
    const partidoEditando = this.partidoEditando();
    const obs = partidoEditando
      ? this.partidosService.editar(partidoEditando.id, this.form)
      : this.partidosService.crear(this.form);

    obs.subscribe({
      next: () => {
        this.guardando.set(false);
        this.cerrarFormulario();
        this.cargarPartidos();
      },
      error: () => {
        this.guardando.set(false);
        this.error.set('Error al guardar el partido');
      }
    });
  }

  eliminar(id: number) {
    if (!confirm('¿Seguro que quieres eliminar este partido?')) return;
    this.partidosService.eliminar(id).subscribe({
      next: () => this.cargarPartidos()
    });
  }

  resultado(p: Partido) {
    if (!p.jugado) return '';
    return p.golesFavor > p.golesContra ? 'victoria'
      : p.golesFavor < p.golesContra ? 'derrota'
      : 'empate';
  }
}