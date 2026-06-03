import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CompeticionesService } from '../../../core/services/competiciones';
import { TemporadasService } from '../../../core/services/temporadas';
import { Competicion } from '../../../core/models/competicion';
import { Temporada } from '../../../core/models/temporada';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-admin-competiciones',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './admin-competiciones.html',
  styleUrl: './admin-competiciones.css'
})
export class AdminCompeticiones implements OnInit {
  competiciones = signal<Competicion[]>([]);
  temporadas = signal<Temporada[]>([]);
  cargando = signal(true);
  mostrarFormulario = signal(false);
  competicionEditando = signal<Competicion | null>(null);
  guardando = signal(false);
  error = signal('');

  form = {
    nombre: '',
    categoria: '',
    idTemporada: 0
  };

  categorias = ['Senior', 'Senior Femenino', 'Juvenil', 'Cadete', 'Infantil', 'Alevín', 'Benjamín', 'Prebenjamín'];

  constructor(
    private competicionesService: CompeticionesService,
    private temporadasService: TemporadasService,
    private title: Title
  ) {}

  ngOnInit() {
      this.title.setTitle('Competiciones - CDFS Palomas');
    this.temporadasService.getTemporadas().subscribe({
      next: (data) => {
        this.temporadas.set(data);
        if (data.length > 0) this.form.idTemporada = data[0].id;
      }
    });
    this.cargarCompeticiones();
  }

  cargarCompeticiones() {
    this.cargando.set(true);
    this.competicionesService.getCompeticiones().subscribe({
      next: (data) => {
        this.competiciones.set(data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }

  abrirFormulario(competicion?: Competicion) {
    if (competicion) {
      this.competicionEditando.set(competicion);
      this.form = {
        nombre: competicion.nombre,
        categoria: competicion.categoria,
        idTemporada: competicion.idTemporada
      };
    } else {
      this.competicionEditando.set(null);
      this.form = {
        nombre: '',
        categoria: '',
        idTemporada: this.temporadas()[0]?.id ?? 0
      };
    }
    this.error.set('');
    this.mostrarFormulario.set(true);
  }

  cerrarFormulario() {
    this.mostrarFormulario.set(false);
    this.competicionEditando.set(null);
  }

  guardar() {
    if (!this.form.nombre || !this.form.categoria || !this.form.idTemporada) {
      this.error.set('Todos los campos son obligatorios');
      return;
    }
    this.guardando.set(true);
    const competicionEditando = this.competicionEditando();
    const obs = competicionEditando
      ? this.competicionesService.editar(competicionEditando.id, this.form)
      : this.competicionesService.crear(this.form);

    obs.subscribe({
      next: () => {
        this.guardando.set(false);
        this.cerrarFormulario();
        this.cargarCompeticiones();
      },
      error: () => {
        this.guardando.set(false);
        this.error.set('Error al guardar la competición');
      }
    });
  }

  eliminar(id: number) {
    if (!confirm('¿Seguro que quieres eliminar esta competición?')) return;
    this.competicionesService.eliminar(id).subscribe({
      next: () => this.cargarCompeticiones()
    });
  }
}