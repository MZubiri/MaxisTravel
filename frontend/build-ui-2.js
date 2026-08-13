const fs = require('fs');
const path = require('path');
const src = path.join(process.cwd(), 'src');
const write = (p, c) => fs.writeFileSync(path.join(src, p), c.trim() + '\n', 'utf8');

// Whatsapp Button
write('app/shared/components/whatsapp-button/whatsapp-button.component.ts', `
import { Component } from '@angular/core';

@Component({
  selector: 'app-whatsapp-button',
  standalone: true,
  template: \`<a href="https://wa.me/51920698122" target="_blank" class="wa-float pulse-anim" title="¡Escríbenos!">
    <svg viewBox="0 0 32 32" width="32" height="32" fill="white"><path d="M16 2a13 13 0 0 0-11 20l-2 6 6-2a13 13 0 1 0 7-24zm0 24a11 11 0 0 1-5.6-1.5l-.4-.2-4.1 1.4 1.1-4-.3-.5A11 11 0 1 1 16 26zm6-8c-.3-.2-2-.9-2.3-1-.3-.2-.5-.3-.7.1s-.8 1-.1 1.3c.7.3 3.9 1.6 4.3 2s-.2 1.4-1.3 1.4c-1 0-3.3-1.2-4.7-2.6-1.4-1.4-2.4-3.5-2.2-4.6.2-1 .6-1.5 1-2 .3-.4.7-.4.9 0 .2.4.7 1.8.8 2.2.2.4 0 .9-.2 1.2l-.6.7c-.2.2-.4.4-.2.8.3.5 1.2 2 2.1 2.8 1 1 2.4 1.4 2.8 1.6.5.2.7.2 1 0 .2-.3 1-1 1.3-1.3.2-.4.2-.7 0-.9z"/></svg>
  </a>\`,
  styles: [\`.wa-float{position:fixed;bottom:40px;right:40px;background-color:#25d366;color:#FFF;border-radius:50px;text-align:center;font-size:30px;box-shadow: 2px 2px 3px #999;z-index:100;display:flex;align-items:center;justify-content:center;width:60px;height:60px;text-decoration:none;transition:all 0.3s;}.wa-float:hover{background-color:#128c7e;transform:scale(1.1);}\`]
})
export class WhatsappButtonComponent {}
`);

// Footer
write('app/shared/components/footer/footer.component.ts', `
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {}
`);

write('app/shared/components/footer/footer.component.html', `
<div class="andean-divider"></div>
<footer class="footer">
  <div class="footer-container">
    <div class="footer-col">
      <img src="assets/images/logo.jpeg" alt="MaxisTravel" class="footer-logo">
      <p>Descubre la magia del Imperio Inca con nosotros.</p>
    </div>
    <div class="footer-col">
      <h3>Enlaces Rápidos</h3>
      <ul>
        <li><a routerLink="/">Inicio</a></li>
        <li><a routerLink="/tours">Tours</a></li>
        <li><a routerLink="/nosotros">Nosotros</a></li>
        <li><a routerLink="/contacto">Contacto</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h3>Contacto</h3>
      <p>📍 Cusco, Perú</p>
      <p>📱 +51 920 698 122</p>
      <p>✉️ info@maxistravel.com</p>
    </div>
  </div>
  <div class="footer-bottom">
    <p>© 2024 MaxisTravel - Transporte & Turismo. Todos los derechos reservados.</p>
  </div>
</footer>
`);

write('app/shared/components/footer/footer.component.css', `
.footer { background: var(--color-dark); color: white; padding-top: var(--spacing-xl); }
.footer-container { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: var(--spacing-lg); padding: 0 var(--spacing-md); }
.footer-logo { width: 120px; border-radius: 8px; margin-bottom: var(--spacing-md); }
.footer-col h3 { color: var(--color-accent); margin-bottom: var(--spacing-md); }
.footer-col ul { list-style: none; padding: 0; }
.footer-col ul li { margin-bottom: 10px; }
.footer-col ul li a { color: var(--color-light); text-decoration: none; transition: var(--transition); }
.footer-col ul li a:hover { color: var(--color-primary); padding-left: 5px; }
.footer-bottom { text-align: center; padding: var(--spacing-md); margin-top: var(--spacing-lg); border-top: 1px solid rgba(255,255,255,0.1); font-size: 0.9rem; }
`);

// Tours Page
write('app/pages/tours/tours.component.ts', `
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourCardComponent } from '../../shared/components/tour-card/tour-card.component';
import { TourService } from '../../core/services/tour.service';
import { Tour } from '../../core/models/tour.model';

@Component({
  selector: 'app-tours',
  standalone: true,
  imports: [CommonModule, TourCardComponent],
  templateUrl: './tours.component.html',
  styleUrls: ['./tours.component.css']
})
export class ToursComponent implements OnInit {
  tours: Tour[] = [];
  filteredTours: Tour[] = [];
  activeFilter = 'Todos';
  filters = ['Todos', 'Cultural', 'Aventura', 'Naturaleza'];

  constructor(private tourService: TourService) {}

  ngOnInit() {
    this.tourService.getTours().subscribe(t => {
      this.tours = t;
      this.filteredTours = t;
    });
  }

  setFilter(filter: string) {
    this.activeFilter = filter;
    if (filter === 'Todos') this.filteredTours = this.tours;
    else this.filteredTours = this.tours.filter(t => t.type === filter);
  }
}
`);

write('app/pages/tours/tours.component.html', `
<div class="tours-hero">
  <div class="overlay"></div>
  <h1>Nuestros Tours en Cusco</h1>
</div>

<div class="container section-padding">
  <div class="filter-bar">
    <button *ngFor="let filter of filters" 
            class="filter-btn" 
            [class.active]="activeFilter === filter"
            (click)="setFilter(filter)">
      {{ filter }}
    </button>
  </div>

  <div class="tours-grid">
    <app-tour-card *ngFor="let tour of filteredTours" [tour]="tour"></app-tour-card>
  </div>
</div>
`);

write('app/pages/tours/tours.component.css', `
.tours-hero { height: 40vh; background: url('../../../assets/images/tours/valle-001.jpg') center/cover; position: relative; display: flex; align-items: center; justify-content: center; color: white; text-align: center; }
.overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.5); z-index: 1; }
.tours-hero h1 { position: relative; z-index: 2; font-size: 3rem; }
.filter-bar { display: flex; justify-content: center; gap: 15px; margin-bottom: var(--spacing-xl); flex-wrap: wrap; }
.filter-btn { background: var(--color-light); border: none; padding: 10px 20px; border-radius: 20px; cursor: pointer; font-weight: bold; transition: var(--transition); }
.filter-btn:hover, .filter-btn.active { background: var(--color-primary); color: white; }
.tours-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: var(--spacing-lg); }
`);

// Add Footer and WA to app component
write('app/app.component.html', `
<app-navbar *ngIf="!isAdmin"></app-navbar>
<router-outlet></router-outlet>
<app-whatsapp-button *ngIf="!isAdmin"></app-whatsapp-button>
<app-footer *ngIf="!isAdmin"></app-footer>
`);

console.log('Tours and Footer script completed.');
