import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-pabellon',
  standalone: true,
  templateUrl: './pabellon.html',
  styleUrl: './pabellon.css'
})
export class Pabellon {
  constructor(private title: Title) {
    this.title.setTitle('Pabellón - CDFS Palomas');
  }
}