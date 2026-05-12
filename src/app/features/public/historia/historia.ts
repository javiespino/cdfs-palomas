import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-historia',
  standalone: true,
  templateUrl: './historia.html',
  styleUrl: './historia.css'
})
export class Historia {
  constructor(private title: Title) {
    this.title.setTitle('Historia - CDFS Palomas');
  }
}