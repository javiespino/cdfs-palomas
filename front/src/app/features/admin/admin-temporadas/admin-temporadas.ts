import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TemporadasService } from '../../../core/services/temporadas';
import { Temporada } from '../../../core/models/temporada';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-admin-temporadas',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './admin-temporadas.html',
  styleUrl: './admin-temporadas.css'
})
export class AdminTemporadas implements OnInit {
  temporadas = signal<Temporada[]>([]);
  cargando = signal(true);
  mostrarFormulario = signal(false);
  temporadaEditando = signal<Temporada | null>(null);
  guardando = signal(false);
  error = signal('');

  form = { nombre: '' };

  constructor(
    private temporadasService: TemporadasService,
    private title: Title
  ) {}

  ngOnInit() {
    this.title.setTitle('Temporadas - CDFS Palomas');
    this.cargarTemporadas();
  }

  cargarTemporadas() {
    this.cargando.set(true);
    this.temporadasService.getTemporadas().subscribe({
      next: (data) => {
        this.temporadas.set(data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }

  abrirFormulario(temporada?: Temporada) {
    if (temporada) {
      this.temporadaEditando.set(temporada);
      this.form.nombre = temporada.nombre;
    } else {
      this.temporadaEditando.set(null);
      this.form.nombre = '';
    }
    this.error.set('');
    this.mostrarFormulario.set(true);
  }

  cerrarFormulario() {
    this.mostrarFormulario.set(false);
    this.temporadaEditando.set(null);
  }

  guardar() {
    if (!this.form.nombre) {
      this.error.set('El nombre es obligatorio');
      return;
    }
    this.guardando.set(true);
    const temporadaEditando = this.temporadaEditando();
    const obs = temporadaEditando
      ? this.temporadasService.editar(temporadaEditando.id, this.form.nombre)
      : this.temporadasService.crear(this.form.nombre);

    obs.subscribe({
      next: () => {
        this.guardando.set(false);
        this.cerrarFormulario();
        this.cargarTemporadas();
      },
      error: () => {
        this.guardando.set(false);
        this.error.set('Error al guardar la temporada');
      }
    });
  }

  eliminar(id: number) {
    if (!confirm('¿Seguro que quieres eliminar esta temporada?')) return;
    this.temporadasService.eliminar(id).subscribe({
      next: () => this.cargarTemporadas()
    });
  }
}