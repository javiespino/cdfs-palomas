import { Component, OnInit, signal, computed } from '@angular/core';
import { JugadoresService } from '../../../core/services/jugadores';
import { TemporadasService } from '../../../core/services/temporadas';
import { CompeticionesService } from '../../../core/services/competiciones';
import { Estadistica } from '../../../core/models/estadistica';
import { Temporada } from '../../../core/models/temporada';
import { Competicion } from '../../../core/models/competicion';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  templateUrl: './estadisticas.html',
  styleUrl: './estadisticas.css'
})
export class Estadisticas implements OnInit {
  estadisticasPorCategoria = signal<{ categoria: string; jugadores: Estadistica[] }[]>([]);
  estadisticas = signal<Estadistica[]>([]);
  temporadas = signal<Temporada[]>([]);
  competiciones = signal<Competicion[]>([]);
  categorias = signal<string[]>([]);

  temporadaSeleccionada = signal<number | null>(null);
  categoriaSeleccionada = signal<string>('');
  competicionSeleccionada = signal<number | null>(null);
  cargando = signal(true);
  ordenPor = signal<string>('goles');

  modoHistorico = signal(true);

  constructor(
    private jugadoresService: JugadoresService,
    private temporadasService: TemporadasService,
    private competicionesService: CompeticionesService,
    private title: Title
  ) {}

  ngOnInit() {
    this.title.setTitle('Estadísticas - CDFS Palomas');
    this.temporadasService.getTemporadas().subscribe({
      next: (data) => this.temporadas.set(data)
    });
    this.cargarEstadisticas();
  }

  onTemporadaChange(id: string) {
    this.temporadaSeleccionada.set(id ? parseInt(id) : null);
    this.categoriaSeleccionada.set('');
    this.competicionSeleccionada.set(null);
    this.competiciones.set([]);
    this.categorias.set([]);
    this.modoHistorico.set(!id);

    if (id) {
      this.competicionesService.getPorTemporada(parseInt(id)).subscribe({
        next: (data) => {
          const cats = [...new Set(data.map(c => c.categoria))];
          this.categorias.set(cats);
        }
      });
    }
  }

  onCategoriaChange(cat: string) {
    this.categoriaSeleccionada.set(cat);
    this.competicionSeleccionada.set(null);
    this.competiciones.set([]);

    if (cat) {
      const idTemporada = this.temporadaSeleccionada();
      const obs = idTemporada
        ? this.competicionesService.getPorTemporada(idTemporada)
        : this.competicionesService.getCompeticiones();

      obs.subscribe({
        next: (data) => {
          const filtradas = data.filter(c => c.categoria === cat);
          const unicas = filtradas.filter((c, i, arr) =>
            arr.findIndex(x => x.nombre === c.nombre) === i
          );
          this.competiciones.set(unicas);
        }
      });
    }
  }

  onCompeticionChange(id: string) {
    this.competicionSeleccionada.set(id ? parseInt(id) : null);
  }

  buscar() {
    this.cargarEstadisticas();
  }

  cargarEstadisticas() {
    this.cargando.set(true);

    if (!this.temporadaSeleccionada() && !this.categoriaSeleccionada() && !this.competicionSeleccionada()) {
      this.jugadoresService.getHistorico().subscribe({
        next: (data) => {
          this.estadisticasPorCategoria.set(data.map((d: any) => ({
            categoria: d.categoria,
            jugadores: d.jugadores
          })));
          this.estadisticas.set([]);
          this.modoHistorico.set(true);
          this.cargando.set(false);
        },
        error: () => this.cargando.set(false)
      });
    } else {
      this.modoHistorico.set(false);
      this.jugadoresService.getEstadisticas(
        this.temporadaSeleccionada() ?? undefined,
        this.categoriaSeleccionada() || undefined,
        this.competicionSeleccionada() ?? undefined
      ).subscribe({
        next: (data) => {
          this.estadisticas.set(data);
          this.estadisticasPorCategoria.set([]);
          this.cargando.set(false);
        },
        error: () => this.cargando.set(false)
      });
    }
  }

  ordenar(campo: string) {
    this.ordenPor.set(campo);
  }

  ordenarHistorico(categoria: string, campo: string) {
    this.estadisticasPorCategoria.update(grupos =>
      grupos.map(g => {
        if (g.categoria === categoria) {
          return {
            ...g,
            jugadores: [...g.jugadores].sort((a: any, b: any) => b[campo] - a[campo])
          };
        }
        return g;
      })
    );
  }

  ordenCampoHistorico: { [categoria: string]: string } = {};

  setOrdenHistorico(categoria: string, campo: string) {
    this.ordenCampoHistorico[categoria] = campo;
    this.ordenarHistorico(categoria, campo);
  }

  estadisticasOrdenadas() {
    const campo = this.ordenPor() as keyof Estadistica;
    return [...this.estadisticas()].sort((a, b) => (b[campo] as number) - (a[campo] as number));
  }
}