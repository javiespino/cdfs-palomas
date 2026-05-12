import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CuerpoTecnicoService, CuerpoTecnicoPersona, CuerpoTecnicoAsignacion } from '../../../core/services/cuerpo-tecnico';
import { TemporadasService } from '../../../core/services/temporadas';
import { Temporada } from '../../../core/models/temporada';
import { environment } from '../../../../enviroment/enviroment';

@Component({
  selector: 'app-admin-cuerpo-tecnico',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './admin-cuerpo-tecnico.html',
  styleUrl: './admin-cuerpo-tecnico.css'
})
export class AdminCuerpoTecnico implements OnInit {
  vista = signal<'personas' | 'asignaciones'>('personas');
  personas = signal<CuerpoTecnicoPersona[]>([]);
  asignaciones = signal<CuerpoTecnicoAsignacion[]>([]);
  temporadas = signal<Temporada[]>([]);
  cargando = signal(true);
  mostrarFormPersona = signal(false);
  mostrarFormAsignacion = signal(false);
  personaEditando = signal<CuerpoTecnicoPersona | null>(null);
  guardando = signal(false);
  error = signal('');
  mediaUrl = environment.mediaUrl;

  formPersona = { nombre: '', apellidos: '' };
  fotoSeleccionada: File | null = null;

  formAsignacion = {
    idCuerpoTecnico: 0,
    idTemporada: 0,
    categoria: '',
    cargo: ''
  };

  categorias = ['Senior', 'Senior Femenino', 'Juvenil', 'Cadete', 'Infantil', 'Alevín', 'Benjamín', 'Prebenjamín'];

  constructor(
    private cuerpoTecnicoService: CuerpoTecnicoService,
    private temporadasService: TemporadasService
  ) {}

  ngOnInit() {
    this.temporadasService.getTemporadas().subscribe({
      next: (data) => {
        this.temporadas.set(data);
        if (data.length > 0) this.formAsignacion.idTemporada = data[data.length - 1].id;
      }
    });
    this.cargarPersonas();
    this.cargarAsignaciones();
  }

  cargarPersonas() {
    this.cargando.set(true);
    this.cuerpoTecnicoService.getPersonas().subscribe({
      next: (data) => {
        this.personas.set(data);
        this.cargando.set(false);
      }
    });
  }

  cargarAsignaciones() {
    this.cuerpoTecnicoService.getAsignaciones().subscribe({
      next: (data) => this.asignaciones.set(data)
    });
  }

  onFotoChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) this.fotoSeleccionada = input.files[0];
  }

  abrirFormPersona(persona?: CuerpoTecnicoPersona) {
    if (persona) {
      this.personaEditando.set(persona);
      this.formPersona = { nombre: persona.nombre, apellidos: persona.apellidos };
    } else {
      this.personaEditando.set(null);
      this.formPersona = { nombre: '', apellidos: '' };
    }
    this.fotoSeleccionada = null;
    this.error.set('');
    this.mostrarFormPersona.set(true);
  }

  cerrarFormPersona() {
    this.mostrarFormPersona.set(false);
    this.personaEditando.set(null);
  }

  guardarPersona() {
    if (!this.formPersona.nombre || !this.formPersona.apellidos) {
      this.error.set('Nombre y apellidos son obligatorios');
      return;
    }
    this.guardando.set(true);
    const formData = new FormData();
    formData.append('nombre', this.formPersona.nombre);
    formData.append('apellidos', this.formPersona.apellidos);
    if (this.fotoSeleccionada) formData.append('foto', this.fotoSeleccionada);

    const personaEditando = this.personaEditando();
    const obs = personaEditando
      ? this.cuerpoTecnicoService.editarPersona(personaEditando.id, formData)
      : this.cuerpoTecnicoService.crearPersona(formData);

    obs.subscribe({
      next: () => {
        this.guardando.set(false);
        this.cerrarFormPersona();
        this.cargarPersonas();
      },
      error: () => {
        this.guardando.set(false);
        this.error.set('Error al guardar');
      }
    });
  }

  eliminarPersona(id: number) {
    if (!confirm('¿Seguro? Se eliminarán también todas sus asignaciones.')) return;
    this.cuerpoTecnicoService.eliminarPersona(id).subscribe({
      next: () => {
        this.cargarPersonas();
        this.cargarAsignaciones();
      }
    });
  }

  abrirFormAsignacion() {
    this.formAsignacion = {
      idCuerpoTecnico: this.personas()[0]?.id ?? 0,
      idTemporada: this.temporadas()[this.temporadas().length - 1]?.id ?? 0,
      categoria: '',
      cargo: ''
    };
    this.error.set('');
    this.mostrarFormAsignacion.set(true);
  }

  cerrarFormAsignacion() {
    this.mostrarFormAsignacion.set(false);
  }

  guardarAsignacion() {
    if (!this.formAsignacion.idCuerpoTecnico || !this.formAsignacion.idTemporada ||
        !this.formAsignacion.categoria || !this.formAsignacion.cargo) {
      this.error.set('Todos los campos son obligatorios');
      return;
    }
    this.guardando.set(true);
    this.cuerpoTecnicoService.crearAsignacion(this.formAsignacion).subscribe({
      next: () => {
        this.guardando.set(false);
        this.cerrarFormAsignacion();
        this.cargarAsignaciones();
      },
      error: () => {
        this.guardando.set(false);
        this.error.set('Error al guardar la asignación');
      }
    });
  }

  eliminarAsignacion(id: number) {
    if (!confirm('¿Eliminar esta asignación?')) return;
    this.cuerpoTecnicoService.eliminarAsignacion(id).subscribe({
      next: () => this.cargarAsignaciones()
    });
  }
}