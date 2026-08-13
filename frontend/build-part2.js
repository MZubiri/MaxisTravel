const fs = require('fs');
const path = require('path');
const src = path.join(process.cwd(), 'src');
const write = (p, c) => {
  const fp = path.join(src, p);
  fs.mkdirSync(path.dirname(fp), {recursive: true});
  fs.writeFileSync(fp, c.trim() + '\n', 'utf8');
};

write('app/pages/tour-detail/tour-detail.component.ts', `
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TourService } from '../../core/services/tour.service';
import { Tour } from '../../core/models/tour.model';

@Component({
  selector: 'app-tour-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tour-detail.component.html',
  styleUrls: ['./tour-detail.component.css']
})
export class TourDetailComponent implements OnInit {
  tour!: Tour;
  whatsappLink = '';

  constructor(private route: ActivatedRoute, private tourService: TourService, private router: Router) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        this.tourService.getTourBySlug(slug).subscribe(t => {
          if (t) {
            this.tour = t;
            this.whatsappLink = \`https://wa.me/51920698122?text=Hola MaxisTravel, estoy interesado en el tour \${t.name}.\`;
          } else {
            this.router.navigate(['/tours']);
          }
        });
      }
    });
  }
}
`);

write('app/pages/tour-detail/tour-detail.component.html', `
<section class="tour-hero" *ngIf="tour">
  <div class="tour-hero-image">
    <img [src]="tour.imageUrl" [alt]="tour.name">
    <div class="tour-hero-overlay">
      <div class="tour-hero-content">
        <span class="tour-badge" [class]="tour.difficulty">{{tour.difficulty}}</span>
        <h1>{{tour.name}}</h1>
        <div class="tour-meta-badges">
          <span>⏱️ {{tour.duration}}</span>
          <span>🏔️ {{tour.altitude}}</span>
          <span>🚐 {{tour.modality}}</span>
        </div>
      </div>
    </div>
  </div>
</section>

<div class="tour-detail-layout container section-padding" *ngIf="tour">
  <main class="tour-content">
    <section class="tour-description fade-in-up">
      <h2>Sobre este tour</h2>
      <p>{{tour.fullDescription || tour.description}}</p>
    </section>

    <section class="tour-itinerary fade-in-up" style="animation-delay:0.2s">
      <h2>🗺️ Itinerario</h2>
      <div class="timeline">
        <div class="timeline-item" *ngFor="let item of tour.itinerary">
          <div class="timeline-time">{{item.time}}</div>
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <h3>{{item.icon}} {{item.title}}</h3>
            <p *ngIf="item.description">{{item.description}}</p>
          </div>
        </div>
      </div>
    </section>

    <section class="tour-includes fade-in-up" style="animation-delay:0.4s">
      <div class="includes-grid">
        <div class="includes-col">
          <h3>✅ Incluye</h3>
          <ul>
            <li *ngFor="let item of tour.includes">✔️ {{item}}</li>
          </ul>
        </div>
        <div class="includes-col">
          <h3>❌ No incluye</h3>
          <ul>
            <li *ngFor="let item of tour.notIncludes">❌ {{item}}</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="tour-bring fade-in-up" style="animation-delay:0.6s">
      <h2>🎒 ¿Qué llevar?</h2>
      <div class="bring-grid">
        <span *ngFor="let item of tour.whatToBring" class="bring-item">{{item}}</span>
      </div>
    </section>
  </main>

  <aside class="tour-sidebar fade-in-up" style="animation-delay:0.2s">
    <div class="sidebar-card">
      <div class="sidebar-price">
        <span class="price-from">Desde</span>
        <span class="price-amount">US$ {{tour.price}}</span>
        <span class="price-per">por persona</span>
      </div>
      <a [href]="whatsappLink" target="_blank" class="btn-whatsapp-book">
        💬 Reservar por WhatsApp
      </a>
      <div class="sidebar-info">
        <div class="info-row"><span>⏱️ Duración</span><span>{{tour.duration}}</span></div>
        <div class="info-row"><span>🥾 Dificultad</span><span>{{tour.difficulty}}</span></div>
        <div class="info-row"><span>🏔️ Altitud máx.</span><span>{{tour.altitude}}</span></div>
        <div class="info-row"><span>⏰ Horario</span><span>{{tour.schedule}}</span></div>
        <div class="info-row"><span>🚐 Modalidad</span><span>{{tour.modality}}</span></div>
      </div>
    </div>
  </aside>
</div>
`);

write('app/pages/tour-detail/tour-detail.component.css', `
.tour-hero { position: relative; height: 60vh; }
.tour-hero-image { width: 100%; height: 100%; position: relative; }
.tour-hero-image img { width: 100%; height: 100%; object-fit: cover; }
.tour-hero-overlay { position: absolute; inset: 0; background: linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.2)); display: flex; align-items: flex-end; padding: var(--spacing-xl) var(--spacing-md); }
.tour-hero-content { max-width: 1200px; margin: 0 auto; width: 100%; color: white; }
.tour-badge { background: var(--color-primary); padding: 5px 10px; border-radius: 4px; font-weight: bold; font-size: 0.9rem; }
.tour-hero-content h1 { font-size: 3rem; margin: 10px 0; }
.tour-meta-badges { display: flex; gap: 15px; font-size: 1.1rem; }

.tour-detail-layout { display: grid; grid-template-columns: 2fr 1fr; gap: var(--spacing-xl); }
.tour-content section { margin-bottom: var(--spacing-xl); }
.tour-content h2 { color: var(--color-primary); margin-bottom: var(--spacing-md); border-bottom: 2px solid var(--color-light); padding-bottom: 10px; }

.timeline { position: relative; padding-left: 30px; }
.timeline::before { content: ''; position: absolute; left: 10px; top: 0; bottom: 0; width: 2px; background: var(--color-light); }
.timeline-item { position: relative; margin-bottom: 20px; }
.timeline-dot { position: absolute; left: -25px; top: 5px; width: 12px; height: 12px; border-radius: 50%; background: var(--color-primary); }
.timeline-time { font-weight: bold; color: var(--color-secondary); margin-bottom: 5px; }
.timeline-content { background: var(--color-bg); padding: 15px; border-radius: var(--border-radius); border-left: 3px solid var(--color-primary); }

.includes-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-md); }
.includes-col ul { list-style: none; padding: 0; }
.includes-col ul li { margin-bottom: 8px; font-size: 1.05rem; }

.bring-grid { display: flex; flex-wrap: wrap; gap: 10px; }
.bring-item { background: var(--color-light); padding: 8px 15px; border-radius: 20px; font-size: 0.95rem; }

.tour-sidebar { position: sticky; top: 100px; }
.sidebar-card { background: white; padding: var(--spacing-lg); border-radius: var(--border-radius); box-shadow: var(--shadow-md); border-top: 5px solid var(--color-primary); }
.sidebar-price { display: flex; flex-direction: column; text-align: center; margin-bottom: var(--spacing-lg); }
.price-from { color: #666; font-size: 0.9rem; }
.price-amount { font-size: 2.5rem; font-weight: bold; color: var(--color-dark); margin: 5px 0; }
.price-per { color: #666; font-size: 0.9rem; }
.btn-whatsapp-book { display: block; background: #25D366; color: white; text-align: center; padding: 15px; border-radius: var(--border-radius); font-weight: bold; font-size: 1.1rem; text-decoration: none; margin-bottom: var(--spacing-lg); transition: var(--transition); }
.btn-whatsapp-book:hover { background: #128C7E; transform: translateY(-3px); }
.sidebar-info { border-top: 1px solid #eee; padding-top: var(--spacing-md); }
.info-row { display: flex; justify-content: space-between; margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px dashed #eee; }
.info-row span:first-child { color: #666; font-weight: 500; }
.info-row span:last-child { font-weight: bold; color: var(--color-dark); text-align: right; }

@media (max-width: 900px) {
  .tour-detail-layout { grid-template-columns: 1fr; }
  .tour-sidebar { position: static; order: -1; }
  .includes-grid { grid-template-columns: 1fr; }
}
`);
console.log('Script 2 done');
