import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NoticiasService } from '../../../core/services/noticias';
import { Noticia } from '../../../core/models/noticia';
import { environment } from '../../../../enviroment/enviroment';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-admin-noticias',
  standalone: true,
  imports: [FormsModule, DatePipe, RouterLink],
  templateUrl: './admin-noticias.html',
  styleUrl: './admin-noticias.css'
})
export class AdminNoticias implements OnInit {
  noticias = signal<Noticia[]>([]);
  cargando = signal(true);
  mostrarFormulario = signal(false);
  noticiaEditando = signal<Noticia | null>(null);
  guardando = signal(false);
  error = signal('');
  mediaUrl = environment.mediaUrl;

  form = {
    titulo: '',
    contenido: ''
  };
  imagenSeleccionada: File | null = null;

  constructor(
    private noticiasService: NoticiasService,
    private title: Title
  ) {}

  ngOnInit() {
    this.title.setTitle('Noticias - CDFS Palomas');
    this.cargarNoticias();
  }

  cargarNoticias() {
    this.cargando.set(true);
    this.noticiasService.getNoticias().subscribe({
      next: (data) => {
        this.noticias.set(data);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }

  abrirFormulario(noticia?: Noticia) {
    if (noticia) {
      this.noticiaEditando.set(noticia);
      this.form = { titulo: noticia.titulo, contenido: noticia.contenido };
    } else {
      this.noticiaEditando.set(null);
      this.form = { titulo: '', contenido: '' };
    }
    this.imagenSeleccionada = null;
    this.previstaImagen.set(null);
    this.error.set('');
    this.mostrarFormulario.set(true);
  }

  cerrarFormulario() {
    this.mostrarFormulario.set(false);
    this.noticiaEditando.set(null);
  }

  onImagenChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.imagenSeleccionada = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => this.previstaImagen.set(e.target?.result as string);
      reader.readAsDataURL(this.imagenSeleccionada);
    }
  }

  guardar() {
    if (!this.form.titulo || !this.form.contenido) {
      this.error.set('Título y contenido son obligatorios');
      return;
    }

    this.guardando.set(true);
    const formData = new FormData();
    formData.append('titulo', this.form.titulo);
    formData.append('contenido', this.form.contenido);
    if (this.imagenSeleccionada) {
      formData.append('imagen', this.imagenSeleccionada);
    }

    const noticiaEditando = this.noticiaEditando();
    const obs = noticiaEditando
      ? this.noticiasService.editar(noticiaEditando.id, formData)
      : this.noticiasService.crear(formData);

    obs.subscribe({
      next: () => {
        this.guardando.set(false);
        this.cerrarFormulario();
        this.cargarNoticias();
      },
      error: () => {
        this.guardando.set(false);
        this.error.set('Error al guardar la noticia');
      }
    });
  }

  eliminar(id: number) {
    if (!confirm('¿Seguro que quieres eliminar esta noticia?')) return;
    this.noticiasService.eliminar(id).subscribe({
      next: () => this.cargarNoticias()
    });
  }

  previstaImagen = signal<string | null>(null);

  onPaste(event: ClipboardEvent) {
    const items = event.clipboardData?.items;
    if (!items) return;

    for (const item of Array.from(items)) {
      if (item.type.startsWith('image/')) {
        event.preventDefault();
        const file = item.getAsFile();
        if (file) {
          this.imagenSeleccionada = file;
          const reader = new FileReader();
          reader.onload = (e) => this.previstaImagen.set(e.target?.result as string);
          reader.readAsDataURL(file);
        }
        break;
      }
    }
  }

  quitarImagen() {
    this.imagenSeleccionada = null;
    this.previstaImagen.set(null);
  }
}