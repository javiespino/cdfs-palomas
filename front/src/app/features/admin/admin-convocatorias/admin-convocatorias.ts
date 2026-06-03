import { Component, OnInit, signal, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ConvocatoriasService } from '../../../core/services/convocatorias';
import { JugadoresService } from '../../../core/services/jugadores';
import { Convocatoria } from '../../../core/models/convocatoria';
import { Jugador } from '../../../core/models/jugador';
import { Partido } from '../../../core/models/partido';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-admin-convocatorias',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-convocatorias.html',
  styleUrl: './admin-convocatorias.css'
})
export class AdminConvocatorias implements OnInit {
  @Input() partido!: Partido;
  @Input() onCerrar!: () => void;

  convocatorias = signal<Convocatoria[]>([]);
  jugadoresDisponibles = signal<Jugador[]>([]);
  cargando = signal(true);
  guardando = signal(false);
  vista = signal<'convocatoria' | 'estadisticas'>('convocatoria');

  constructor(
    private convocatoriasService: ConvocatoriasService,
    private jugadoresService: JugadoresService,
    private title: Title
  ) {}

  ngOnInit() {
      this.title.setTitle('Convocatorias - CDFS Palomas');
    this.cargarDatos();
  }

  cargarDatos() {
    this.cargando.set(true);
    this.jugadoresService.getJugadores().subscribe({
      next: (jugadores) => {
        this.jugadoresDisponibles.set(jugadores);
        this.cargarConvocatorias();
      }
    });
  }

  cargarConvocatorias() {
    this.convocatoriasService.getPorPartido(this.partido.id).subscribe({
      next: (data) => {
        this.convocatorias.set(data);
        this.cargando.set(false);
      }
    });
  }

  busqueda = signal('');

  jugadoresNoConvocados() {
    const idsConvocados = this.convocatorias().map(c => c.idJugador);
    return this.jugadoresDisponibles()
      .filter(j => !idsConvocados.includes(j.id))
      .filter(j => !this.busqueda() || 
        `${j.nombre} ${j.apellidos}`.toLowerCase().includes(this.busqueda().toLowerCase()));
  }

  quitar(id: number) {
    this.convocatoriasService.quitar(id).subscribe({
      next: () => this.cargarConvocatorias()
    });
  }

  annadir(idJugador: number) {
    this.convocatoriasService.añadir(this.partido.id, idJugador).subscribe({
      next: () => this.cargarConvocatorias()
    });
  }

  guardadoOk = signal(false);

  guardarEstadisticas() {
    const titulares = this.convocatorias().filter(c => c.titular).length;
    if (titulares !== 5) {
      alert(`Debes tener exactamente 5 titulares. Ahora tienes ${titulares}.`);
      return;
    }

    this.guardando.set(true);
    const estadisticas = this.convocatorias().map(c => ({
      idConvocatoria: c.id,
      titular: c.titular,
      goles: c.goles,
      amarillas: c.amarillas,
      dobleAmarilla: c.dobleAmarilla,
      roja: c.roja
    }));

    this.convocatoriasService.actualizarEstadisticas(this.partido.id, estadisticas).subscribe({
      next: () => {
        this.guardando.set(false);
        this.guardadoOk.set(true);
        setTimeout(() => {
          this.guardadoOk.set(false);
          this.onCerrar();
        }, 1500);
      },
      error: () => this.guardando.set(false)
    });
  }

  seleccionarTarjeta(convocatoria: any, tipo: 'amarilla' | 'dobleAmarilla' | 'roja') {
    if (tipo === 'amarilla') {
      convocatoria.amarillas = convocatoria.amarillas > 0 ? 0 : 1;
      convocatoria.dobleAmarilla = false;
      convocatoria.roja = false;
    } else if (tipo === 'dobleAmarilla') {
      convocatoria.dobleAmarilla = !convocatoria.dobleAmarilla;
      convocatoria.amarillas = 0;
      convocatoria.roja = false;
    } else if (tipo === 'roja') {
      convocatoria.roja = !convocatoria.roja;
      convocatoria.amarillas = 0;
      convocatoria.dobleAmarilla = false;
    }
  }
}