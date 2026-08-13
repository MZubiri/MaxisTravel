const fs = require('fs');
const path = require('path');

const src = path.join(process.cwd(), 'src');

const write = (filePath, content) => {
  const fullPath = path.join(src, filePath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
};

// --- SERVICES ---
write('app/core/services/api.service.ts', `
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}
  get<T>(path: string) { return this.http.get<T>(\`\${this.baseUrl}\${path}\`); }
  post<T>(path: string, body: any) { return this.http.post<T>(\`\${this.baseUrl}\${path}\`, body); }
  put<T>(path: string, body: any) { return this.http.put<T>(\`\${this.baseUrl}\${path}\`, body); }
  patch<T>(path: string, body?: any) { return this.http.patch<T>(\`\${this.baseUrl}\${path}\`, body); }
  delete<T>(path: string) { return this.http.delete<T>(\`\${this.baseUrl}\${path}\`); }
}
`);

write('app/core/services/tour.service.ts', `
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Tour } from '../models/tour.model';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TourService {
  constructor(private api: ApiService) {}
  
  // Mock data for immediate frontend rendering
  getMockTours(): Tour[] {
    return [
      { id: '1', slug: 'city-tour-cusco', name: 'City Tour Cusco', price: 20, description: 'Descubre la magia del Cusco y sus ruinas aledañas.', duration: '4h', difficulty: 'Fácil', type: 'Cultural', isPublished: true, imageUrl: 'assets/images/tours/city-tour/city-tour-001.jpeg' },
      { id: '2', slug: 'montana-7-colores', name: 'Montaña 7 Colores', price: 40, description: 'Aventura increible en la montaña Vinicunca.', duration: 'Full Day', difficulty: 'Moderada-Exigente', type: 'Aventura', isPublished: true, imageUrl: 'assets/images/tours/rainbow-001.jpg' },
      { id: '3', slug: 'laguna-humantay', name: 'Laguna Humantay', price: 40, description: 'Trekking hacia una de las lagunas más hermosas.', duration: 'Full Day', difficulty: 'Moderada-Exigente', type: 'Naturaleza', isPublished: true, imageUrl: 'assets/images/tours/humantay-001.jpg' },
      { id: '4', slug: 'valle-sagrado', name: 'Valle Sagrado', price: 50, description: 'Conoce los pueblos del Valle Sagrado de los Incas.', duration: '~12h', difficulty: 'Moderada', type: 'Cultural', isPublished: true, imageUrl: 'assets/images/tours/valle-001.jpg' },
      { id: '5', slug: 'tour-barroco-andino', name: 'Tour Barroco Andino', price: 55, description: 'Ruta de las iglesias coloniales del sur del Cusco.', duration: '1 día', difficulty: 'Fácil', type: 'Cultural', isPublished: true, imageUrl: 'assets/images/tours/barroco-andino/barroco-001.jpeg' }
    ];
  }

  getTours(): Observable<Tour[]> { return of(this.getMockTours()); }
  getTourBySlug(slug: string): Observable<Tour | undefined> { return of(this.getMockTours().find(t => t.slug === slug)); }
}
`);

// --- SHARED COMPONENTS ---

write('app/shared/components/tour-card/tour-card.component.ts', `
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Tour } from '../../../core/models/tour.model';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-tour-card',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  templateUrl: './tour-card.component.html',
  styleUrls: ['./tour-card.component.css']
})
export class TourCardComponent {
  @Input() tour!: Tour;
}
`);

write('app/shared/components/tour-card/tour-card.component.html', `
<div class="tour-card fade-in-up">
  <div class="card-img-wrapper">
    <img [src]="tour.imageUrl" [alt]="tour.name" class="card-img">
    <span class="badge difficulty-badge">{{ tour.difficulty }}</span>
  </div>
  <div class="card-content">
    <h3 class="card-title">{{ tour.name }}</h3>
    <p class="card-desc">{{ tour.description }}</p>
    <div class="card-meta">
      <span>⏱ {{ tour.duration }}</span>
      <span class="price">\${{ tour.price }}</span>
    </div>
    <div class="card-actions">
      <a [routerLink]="['/tours', tour.slug]" class="btn-primary">{{ 'tour.details' | translate }}</a>
    </div>
  </div>
</div>
`);

write('app/shared/components/tour-card/tour-card.component.css', `
.tour-card {
  background: white;
  border-radius: var(--border-radius);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: var(--transition);
  display: flex;
  flex-direction: column;
  height: 100%;
}
.tour-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-md);
}
.card-img-wrapper {
  position: relative;
  height: 200px;
  overflow: hidden;
}
.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}
.tour-card:hover .card-img {
  transform: scale(1.05);
}
.difficulty-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: var(--color-secondary);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
}
.card-content {
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}
.card-title {
  margin-bottom: var(--spacing-sm);
  color: var(--color-dark);
}
.card-desc {
  font-size: 0.9rem;
  color: #666;
  flex-grow: 1;
  margin-bottom: var(--spacing-md);
}
.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
  font-weight: 500;
}
.price {
  font-size: 1.2rem;
  color: var(--color-primary);
  font-weight: bold;
}
.btn-primary {
  display: inline-block;
  width: 100%;
  text-align: center;
  background: var(--color-primary);
  color: white;
  padding: 10px;
  border-radius: var(--border-radius);
  text-decoration: none;
  font-weight: bold;
  transition: var(--transition);
}
.btn-primary:hover {
  background: var(--color-secondary);
}
`);

// --- HOME PAGE ---

write('app/pages/home/home.component.ts', `
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { TourCardComponent } from '../../shared/components/tour-card/tour-card.component';
import { TourService } from '../../core/services/tour.service';
import { Tour } from '../../core/models/tour.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe, TourCardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  tours: Tour[] = [];
  galleryPhotos = [
    'assets/images/tours/barroco-andino/barroco-005.jpeg', 'assets/images/tours/city-tour/city-tour-005.jpeg',
    'assets/images/tours/barroco-andino/barroco-010.jpeg', 'assets/images/tours/city-tour/city-tour-010.jpeg',
    'assets/images/tours/barroco-andino/barroco-015.jpeg', 'assets/images/tours/city-tour/city-tour-015.jpeg',
    'assets/images/tours/barroco-andino/barroco-020.jpeg', 'assets/images/tours/city-tour/city-tour-020.jpeg',
    'assets/images/tours/barroco-andino/barroco-030.jpeg', 'assets/images/tours/city-tour/city-tour-025.jpeg',
    'assets/images/tours/barroco-andino/barroco-040.jpeg', 'assets/images/tours/city-tour/city-tour-030.jpeg'
  ];

  constructor(private tourService: TourService) {}

  ngOnInit() {
    this.tourService.getTours().subscribe(t => this.tours = t);
  }
}
`);

write('app/pages/home/home.component.html', `
<section class="hero-section">
  <div class="hero-overlay"></div>
  <div class="hero-content">
    <img src="assets/images/logo.jpeg" alt="MaxisTravel Logo" class="hero-logo fade-in-up">
    <h1 class="fade-in-up" style="animation-delay: 0.2s">{{ 'hero.title' | translate }}</h1>
    <p class="subtitle fade-in-up" style="animation-delay: 0.4s">{{ 'hero.subtitle' | translate }}</p>
    <div class="hero-actions fade-in-up" style="animation-delay: 0.6s">
      <a routerLink="/tours" class="btn btn-primary">{{ 'hero.cta_tours' | translate }}</a>
      <a href="https://wa.me/51920698122" target="_blank" class="btn btn-whatsapp">{{ 'hero.cta_whatsapp' | translate }}</a>
    </div>
  </div>
  <div class="scroll-indicator">↓</div>
</section>

<div class="andean-divider"></div>

<section class="tours-section section-padding">
  <div class="container">
    <h2 class="section-title text-center">{{ 'tours.title' | translate }}</h2>
    <div class="tours-grid">
      <app-tour-card *ngFor="let tour of tours" [tour]="tour"></app-tour-card>
    </div>
    <div class="text-center mt-lg">
      <a routerLink="/tours" class="link-view-all">Ver todos los tours →</a>
    </div>
  </div>
</section>

<section class="why-us-section section-padding bg-light">
  <div class="container">
    <h2 class="section-title text-center">¿Por qué elegir MaxisTravel?</h2>
    <div class="features-grid">
      <div class="feature-card inca-border fade-in-up">
        <div class="icon">🏔️</div>
        <h3>Experiencia Local</h3>
        <p>10+ años conociendo cada rincón de Cusco</p>
      </div>
      <div class="feature-card inca-border fade-in-up" style="animation-delay: 0.2s">
        <div class="icon">👨‍🏫</div>
        <h3>Guías Profesionales</h3>
        <p>Bilingüe español/inglés, certificados</p>
      </div>
      <div class="feature-card inca-border fade-in-up" style="animation-delay: 0.4s">
        <div class="icon">💰</div>
        <h3>Mejores Precios</h3>
        <p>Precios directos sin intermediarios</p>
      </div>
      <div class="feature-card inca-border fade-in-up" style="animation-delay: 0.6s">
        <div class="icon">🛡️</div>
        <h3>Seguridad Garantizada</h3>
        <p>Equipos de emergencia y primeros auxilios</p>
      </div>
    </div>
  </div>
</section>

<section class="gallery-section section-padding">
  <div class="container">
    <h2 class="section-title text-center">Galería de Experiencias</h2>
    <div class="masonry-grid">
      <div class="masonry-item" *ngFor="let photo of galleryPhotos">
        <img [src]="photo" alt="Experiencia MaxisTravel" loading="lazy">
      </div>
    </div>
  </div>
</section>

<section class="cta-section section-padding">
  <div class="container text-center">
    <h2>¿Listo para tu aventura?</h2>
    <a href="https://wa.me/51920698122" target="_blank" class="btn btn-whatsapp pulse-anim mt-md">Reserva ahora por WhatsApp</a>
  </div>
</section>
`);

write('app/pages/home/home.component.css', `
.hero-section {
  height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  background-image: url('../../../../assets/images/tours/city-tour/city-tour-001.jpeg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}
.hero-overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.7), rgba(0,0,0,0.4));
  z-index: 1;
}
.hero-content {
  position: relative;
  z-index: 2;
  max-width: 800px;
  padding: var(--spacing-md);
}
.hero-logo {
  width: 150px;
  border-radius: 50%;
  margin-bottom: var(--spacing-lg);
  box-shadow: 0 0 20px rgba(255,255,255,0.2);
}
.hero-section h1 {
  font-size: 3.5rem;
  margin-bottom: var(--spacing-sm);
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}
.subtitle {
  font-size: 1.5rem;
  margin-bottom: var(--spacing-lg);
  text-shadow: 1px 1px 3px rgba(0,0,0,0.5);
}
.btn {
  display: inline-block;
  padding: 12px 24px;
  border-radius: 30px;
  font-weight: bold;
  text-decoration: none;
  margin: 0 10px;
  transition: var(--transition);
}
.btn-primary { background: var(--color-primary); color: white; }
.btn-primary:hover { background: var(--color-secondary); transform: scale(1.05); }
.btn-whatsapp { background: #25d366; color: white; }
.btn-whatsapp:hover { background: #128c7e; transform: scale(1.05); }
.scroll-indicator {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  font-size: 2rem;
  animation: bounce 2s infinite;
}
@keyframes bounce { 0%, 20%, 50%, 80%, 100% { transform: translateY(0) translateX(-50%); } 40% { transform: translateY(-20px) translateX(-50%); } 60% { transform: translateY(-10px) translateX(-50%); } }

.section-padding { padding: var(--spacing-xl) var(--spacing-md); }
.container { max-width: 1200px; margin: 0 auto; }
.text-center { text-align: center; }
.section-title { font-size: 2.5rem; color: var(--color-primary); margin-bottom: var(--spacing-lg); }
.mt-md { margin-top: var(--spacing-md); }
.mt-lg { margin-top: var(--spacing-lg); }
.bg-light { background-color: var(--color-light); }

.tours-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-lg);
}
.link-view-all {
  color: var(--color-primary);
  font-weight: bold;
  text-decoration: none;
  font-size: 1.2rem;
}
.link-view-all:hover { text-decoration: underline; }

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
}
.feature-card {
  background: white;
  padding: var(--spacing-lg);
  text-align: center;
  border-radius: var(--border-radius);
  transition: transform 0.3s ease;
}
.feature-card:hover { transform: translateY(-10px); }
.feature-card .icon { font-size: 3rem; margin-bottom: var(--spacing-md); }

.masonry-grid {
  display: columns;
  columns: 3 300px;
  column-gap: var(--spacing-md);
}
.masonry-item { margin-bottom: var(--spacing-md); break-inside: avoid; border-radius: var(--border-radius); overflow: hidden; }
.masonry-item img { width: 100%; display: block; transition: transform 0.3s; }
.masonry-item:hover img { transform: scale(1.05); }

.cta-section { background: var(--color-dark); color: white; }
.pulse-anim { animation: pulse 2s infinite; }

@media (max-width: 768px) {
  .hero-section h1 { font-size: 2.5rem; }
  .subtitle { font-size: 1.2rem; }
  .btn { display: block; margin: 10px auto; max-width: 250px; }
}
`);

// --- NAVBAR ---
write('app/shared/components/navbar/navbar.component.ts', `
import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '../../pipes/translate.pipe';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isScrolled = false;
  menuOpen = false;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
`);

write('app/shared/components/navbar/navbar.component.html', `
<nav class="navbar" [class.scrolled]="isScrolled">
  <div class="nav-container">
    <a routerLink="/" class="logo">
      <img src="assets/images/logo.jpeg" alt="MaxisTravel">
      <span>MaxisTravel</span>
    </a>
    
    <div class="nav-links" [class.active]="menuOpen">
      <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" (click)="toggleMenu()">{{ 'nav.home' | translate }}</a>
      <a routerLink="/tours" routerLinkActive="active" (click)="toggleMenu()">{{ 'nav.tours' | translate }}</a>
      <a routerLink="/nosotros" routerLinkActive="active" (click)="toggleMenu()">{{ 'nav.about' | translate }}</a>
      <a routerLink="/contacto" routerLinkActive="active" (click)="toggleMenu()">{{ 'nav.contact' | translate }}</a>
      
      <div class="nav-actions-mobile">
        <a href="https://wa.me/51920698122" target="_blank" class="btn-wa-nav">WhatsApp</a>
      </div>
    </div>

    <div class="nav-actions">
      <!-- Language Selector Placeholder -->
      <a href="https://wa.me/51920698122" target="_blank" class="btn-wa-nav">WhatsApp</a>
    </div>

    <button class="hamburger" (click)="toggleMenu()">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>
`);

write('app/shared/components/navbar/navbar.component.css', `
.navbar {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 1000;
  padding: 15px 0;
  transition: var(--transition);
  background: transparent;
}
.navbar.scrolled {
  background: white;
  padding: 10px 0;
  box-shadow: var(--shadow-md);
}
.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--spacing-md);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  gap: 10px;
  color: white;
  font-weight: bold;
  font-size: 1.5rem;
}
.navbar.scrolled .logo { color: var(--color-primary); }
.logo img { height: 40px; border-radius: 5px; }

.nav-links {
  display: flex;
  gap: var(--spacing-lg);
  align-items: center;
}
.nav-links a {
  text-decoration: none;
  color: white;
  font-weight: 500;
  transition: var(--transition);
}
.navbar.scrolled .nav-links a { color: var(--color-dark); }
.nav-links a:hover, .nav-links a.active { color: var(--color-accent); }
.navbar.scrolled .nav-links a:hover, .navbar.scrolled .nav-links a.active { color: var(--color-primary); }

.nav-actions { display: flex; align-items: center; gap: 15px; }
.btn-wa-nav {
  background: #25d366;
  color: white !important;
  padding: 8px 16px;
  border-radius: 20px;
  text-decoration: none;
  font-weight: bold;
}

.hamburger { display: none; background: none; border: none; cursor: pointer; }
.hamburger span { display: block; width: 25px; height: 3px; background: white; margin: 5px 0; transition: 0.3s; }
.navbar.scrolled .hamburger span { background: var(--color-dark); }
.nav-actions-mobile { display: none; }

@media (max-width: 768px) {
  .hamburger { display: block; }
  .nav-actions { display: none; }
  .nav-actions-mobile { display: block; margin-top: 20px; }
  .nav-links {
    position: fixed;
    top: 0; right: -100%;
    width: 250px;
    height: 100vh;
    background: white;
    flex-direction: column;
    padding-top: 80px;
    box-shadow: -5px 0 15px rgba(0,0,0,0.1);
    transition: 0.3s ease-in-out;
  }
  .nav-links.active { right: 0; }
  .nav-links a { color: var(--color-dark); font-size: 1.2rem; }
}
`);

// --- APP COMPONENT ---
write('app/app.component.html', `
<app-navbar *ngIf="!isAdmin"></app-navbar>
<router-outlet></router-outlet>
<!-- Add footer and floating button here -->
`);

// --- I18N ---
write('assets/i18n/es.json', `
{
  "nav": { "home": "Inicio", "tours": "Tours", "about": "Nosotros", "contact": "Contacto" },
  "hero": { "title": "Descubre la Magia del Cusco", "subtitle": "Experiencias únicas en la capital del Imperio Inca", "cta_tours": "Explorar Tours", "cta_whatsapp": "Contactar por WhatsApp" },
  "tours": { "title": "Nuestros Tours" },
  "tour": { "details": "Ver detalles" }
}
`);
write('assets/i18n/en.json', `
{
  "nav": { "home": "Home", "tours": "Tours", "about": "About Us", "contact": "Contact" },
  "hero": { "title": "Discover the Magic of Cusco", "subtitle": "Unique experiences in the capital of the Inca Empire", "cta_tours": "Explore Tours", "cta_whatsapp": "Contact via WhatsApp" },
  "tours": { "title": "Our Tours" },
  "tour": { "details": "View Details" }
}
`);

console.log('Script completed.');
