import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { JugadoresService } from '../../../core/services/jugadores';
import { TemporadasService } from '../../../core/services/temporadas';
import { DorsalesService } from '../../../core/services/dorsales';
import { CompeticionesService } from '../../../core/services/competiciones';
import { Jugador } from '../../../core/models/jugador';
import { Temporada } from '../../../core/models/temporada';
import { RouterLink } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-admin-jugadores',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './admin-jugadores.html',
  styleUrl: './admin-jugadores.css'
})
export class AdminJugadores implements OnInit {
  jugadores = signal<Jugador[]>([]);
  temporadas = signal<Temporada[]>([]);
  cargando = signal(true);
  error = signal('');
  mostrarFormulario = signal(false);
  mostrarDorsalFormulario = signal(false);
  jugadorEditando = signal<Jugador | null>(null);
  jugadorDorsal = signal<Jugador | null>(null);
  guardando = signal(false);
  guardandoDorsal = signal(false);

  form = {
    nombre: '',
    apellidos: '',
    posicion: '',
    activo: true
  };

  dorsalForm = {
    dorsalNumero: null as number | null,
    idTemporada: 0
  };

  filtros = {
    nombre: '',
    categoria: '',
    idTemporada: 0
  };

  fotoSeleccionada: File | null = null;
  posiciones = ['Portero', 'Cierre', 'Ala', 'Pivot'];
  categorias = ['Senior', 'Senior Femenino', 'Juvenil', 'Cadete', 'Infantil', 'Alevín', 'Benjamín', 'Prebenjamín'];

  constructor(
    private jugadoresService: JugadoresService,
    private temporadasService: TemporadasService,
    private dorsalesService: DorsalesService,
    private title: Title
  ) {}

  ngOnInit() {
    this.title.setTitle('Jugadores - CDFS Palomas');
    this.temporadasService.getTemporadas().subscribe({
      next: (data) => {
        this.temporadas.set(data);
        if (data.length > 0) {
          this.dorsalForm.idTemporada = data[data.length - 1].id;
        }
      }
    });
    this.cargarJugadores();
  }

  cargarJugadores() {
    this.cargando.set(true);
    this.jugadoresService.filtrar(
      this.filtros.idTemporada || undefined,
      this.filtros.categoria || undefined
    ).subscribe({
      next: (data) => {
        this.jugadores.set(data);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('Error al cargar jugadores');
        this.cargando.set(false);
      }
    });
  }

  jugadoresFiltrados() {
    return this.jugadores().filter(j =>
      !this.filtros.nombre ||
      `${j.nombre} ${j.apellidos}`.toLowerCase().includes(this.filtros.nombre.toLowerCase())
    );
  }

  buscar() {
    this.cargarJugadores();
  }

  onFotoChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) this.fotoSeleccionada = input.files[0];
  }

  abrirFormulario(jugador?: Jugador) {
    if (jugador) {
      this.jugadorEditando.set(jugador);
      this.form = {
        nombre: jugador.nombre,
        apellidos: jugador.apellidos,
        posicion: jugador.posicion ?? '',
        activo: jugador.activo
      };
    } else {
      this.jugadorEditando.set(null);
      this.form = { nombre: '', apellidos: '', posicion: '', activo: true };
    }
    this.fotoSeleccionada = null;
    this.error.set('');
    this.mostrarFormulario.set(true);
  }

  cerrarFormulario() {
    this.mostrarFormulario.set(false);
    this.jugadorEditando.set(null);
  }

  abrirDorsalFormulario(jugador: Jugador) {
    this.jugadorDorsal.set(jugador);
    this.dorsalForm = {
      dorsalNumero: null,
      idTemporada: this.temporadas().length > 0 ? this.temporadas()[this.temporadas().length - 1].id : 0
    };
    this.mostrarDorsalFormulario.set(true);
  }

  cerrarDorsalFormulario() {
    this.mostrarDorsalFormulario.set(false);
    this.jugadorDorsal.set(null);
  }

  guardarDorsal() {
    const jugador = this.jugadorDorsal();
    if (!jugador || !this.dorsalForm.dorsalNumero || !this.dorsalForm.idTemporada) {
      return;
    }

    this.guardandoDorsal.set(true);
    this.dorsalesService.getPorTemporada(this.dorsalForm.idTemporada).subscribe({
      next: (dorsales) => {
        const dorsalExistente = dorsales.find((d: any) => d.idJugador === jugador.id);
        if (dorsalExistente) {
          this.dorsalesService.editar(dorsalExistente.id, {
            idJugador: jugador.id,
            idTemporada: this.dorsalForm.idTemporada,
            dorsalNumero: this.dorsalForm.dorsalNumero!
          }).subscribe({
            next: () => {
              this.guardandoDorsal.set(false);
              this.cerrarDorsalFormulario();
            }
          });
        } else {
          this.dorsalesService.crear({
            idJugador: jugador.id,
            idTemporada: this.dorsalForm.idTemporada,
            dorsalNumero: this.dorsalForm.dorsalNumero!
          }).subscribe({
            next: () => {
              this.guardandoDorsal.set(false);
              this.cerrarDorsalFormulario();
            },
            error: () => this.guardandoDorsal.set(false)
          });
        }
      }
    });
  }

  guardar() {
    if (!this.form.nombre || !this.form.apellidos) {
      this.error.set('Nombre y apellidos son obligatorios');
      return;
    }

    this.guardando.set(true);
    const formData = new FormData();
    formData.append('nombre', this.form.nombre);
    formData.append('apellidos', this.form.apellidos);
    formData.append('posicion', this.form.posicion);
    formData.append('activo', this.form.activo.toString());
    if (this.fotoSeleccionada) formData.append('foto', this.fotoSeleccionada);

    const jugadorEditando = this.jugadorEditando();
    const obs = jugadorEditando
      ? this.jugadoresService.editar(jugadorEditando.id, formData)
      : this.jugadoresService.crear(formData);

    obs.subscribe({
      next: () => {
        this.guardando.set(false);
        this.cerrarFormulario();
        this.cargarJugadores();
      },
      error: () => {
        this.guardando.set(false);
        this.error.set('Error al guardar el jugador');
      }
    });
  }

  eliminar(id: number) {
    if (!confirm('¿Seguro que quieres eliminar este jugador?')) return;
    this.jugadoresService.eliminar(id).subscribe({
      next: () => this.cargarJugadores()
    });
  }
}