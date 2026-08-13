const fs = require('fs');
const path = require('path');
const src = path.join(process.cwd(), 'src');
const write = (p, c) => {
  const fp = path.join(src, p);
  fs.mkdirSync(path.dirname(fp), {recursive: true});
  fs.writeFileSync(fp, c.trim() + '\n', 'utf8');
};

write('app/pages/about/about.component.ts', `
import { Component } from '@angular/core';
@Component({ selector: 'app-about', standalone: true, templateUrl: './about.component.html', styleUrls: ['./about.component.css'] })
export class AboutComponent {}
`);
write('app/pages/about/about.component.html', `
<div class="about-hero">
  <div class="overlay"></div>
  <h1>Sobre MaxisTravel</h1>
</div>
<div class="container section-padding">
  <section class="story-section fade-in-up">
    <h2>Nuestra Historia</h2>
    <p>Somos una agencia de viajes con base en Cusco, apasionada por compartir la herencia Inca con el mundo. Durante más de 5 años, hemos diseñado experiencias inolvidables para miles de viajeros.</p>
  </section>
  <div class="andean-divider"></div>
  <section class="stats-section fade-in-up" style="animation-delay: 0.2s">
    <div class="stat-card inca-border"><h3>5+</h3><p>Años de Experiencia</p></div>
    <div class="stat-card inca-border"><h3>10,000+</h3><p>Viajeros Felices</p></div>
    <div class="stat-card inca-border"><h3>5</h3><p>Tours Únicos</p></div>
    <div class="stat-card inca-border"><h3>100%</h3><p>Seguro</p></div>
  </section>
  <div class="andean-divider"></div>
  <section class="mvw-section fade-in-up" style="animation-delay: 0.4s">
    <div class="mvw-card"><h3>🦅 Misión</h3><p>Brindar el mejor servicio turístico en la región, conectando a nuestros clientes con la magia andina.</p></div>
    <div class="mvw-card"><h3>👁️ Visión</h3><p>Ser reconocidos globalmente como la agencia líder en Cusco por nuestro compromiso y calidad.</p></div>
    <div class="mvw-card"><h3>🤝 Valores</h3><p>Honestidad, Pasión, Sostenibilidad, y Respeto por nuestra cultura.</p></div>
  </section>
</div>
`);
write('app/pages/about/about.component.css', `
.about-hero { height: 40vh; background: url('/assets/images/tours/city-tour/city-tour-005.jpeg') center/cover; position: relative; display: flex; align-items: center; justify-content: center; color: white; text-align: center; }
.overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.5); }
.about-hero h1 { position: relative; z-index: 2; font-size: 3.5rem; }
.story-section { text-align: center; max-width: 800px; margin: 0 auto var(--spacing-xl); }
.story-section h2 { color: var(--color-primary); margin-bottom: var(--spacing-md); font-size: 2.5rem; }
.story-section p { font-size: 1.2rem; line-height: 1.8; color: #555; }
.stats-section { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--spacing-lg); margin: var(--spacing-xl) 0; text-align: center; }
.stat-card { padding: var(--spacing-lg); background: var(--color-light); }
.stat-card h3 { font-size: 2.5rem; color: var(--color-primary); margin-bottom: 10px; }
.mvw-section { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: var(--spacing-lg); margin: var(--spacing-xl) 0; }
.mvw-card { text-align: center; padding: var(--spacing-lg); background: white; border-radius: var(--border-radius); box-shadow: var(--shadow-sm); }
.mvw-card h3 { color: var(--color-secondary); margin-bottom: 15px; font-size: 1.8rem; }
`);

write('app/pages/contact/contact.component.ts', `
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  contact = { name: '', email: '', phone: '', tour: '', message: '' };
  mapUrl: SafeResourceUrl;
  
  constructor(private sanitizer: DomSanitizer) {
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://maps.google.com/maps?q=-13.5319,-71.9675&z=15&output=embed');
  }

  sendWhatsApp() {
    const text = \`Hola MaxisTravel! Soy \${this.contact.name}, me interesa el tour \${this.contact.tour || 'General'}. \${this.contact.message}\`;
    window.open(\`https://wa.me/51920698122?text=\${encodeURIComponent(text)}\`, '_blank');
  }
}
`);
write('app/pages/contact/contact.component.html', `
<div class="contact-hero"><div class="overlay"></div><h1>Contáctanos</h1></div>
<div class="container section-padding contact-layout">
  <div class="contact-form-container fade-in-up">
    <h2>Envíanos un mensaje</h2>
    <form (ngSubmit)="sendWhatsApp()" #form="ngForm">
      <div class="form-group"><label>Nombre</label><input type="text" [(ngModel)]="contact.name" name="name" required class="form-control"></div>
      <div class="form-group"><label>Email</label><input type="email" [(ngModel)]="contact.email" name="email" required class="form-control"></div>
      <div class="form-group"><label>Teléfono</label><input type="text" [(ngModel)]="contact.phone" name="phone" class="form-control"></div>
      <div class="form-group">
        <label>Tour de interés</label>
        <select [(ngModel)]="contact.tour" name="tour" class="form-control">
          <option value="">Seleccione un tour...</option>
          <option value="City Tour">City Tour Cusco</option>
          <option value="Montaña 7 Colores">Montaña 7 Colores</option>
          <option value="Laguna Humantay">Laguna Humantay</option>
          <option value="Valle Sagrado">Valle Sagrado</option>
          <option value="Barroco Andino">Tour Barroco Andino</option>
        </select>
      </div>
      <div class="form-group"><label>Mensaje</label><textarea [(ngModel)]="contact.message" name="message" rows="4" required class="form-control"></textarea></div>
      <button type="submit" class="btn btn-whatsapp w-100" [disabled]="!form.valid">Enviar por WhatsApp</button>
    </form>
  </div>
  <div class="contact-info-container fade-in-up" style="animation-delay: 0.2s">
    <h2>Información</h2>
    <div class="info-items">
      <p>📱 +51 920 698 122</p>
      <p>✉️ info&#64;maxistravel.com</p>
      <p>📍 Cusco, Perú</p>
    </div>
    <div class="map-container">
      <iframe [src]="mapUrl" width="100%" height="300" style="border:0;" allowfullscreen="" loading="lazy"></iframe>
    </div>
  </div>
</div>
`);
write('app/pages/contact/contact.component.css', `
.contact-hero { height: 40vh; background: url('/assets/images/tours/rainbow-001.jpg') center/cover; position: relative; display: flex; align-items: center; justify-content: center; color: white; text-align: center; }
.overlay { position: absolute; inset: 0; background: rgba(0,0,0,0.5); }
.contact-hero h1 { position: relative; z-index: 2; font-size: 3.5rem; }
.contact-layout { display: grid; grid-template-columns: 1fr 1fr; gap: var(--spacing-xl); }
.contact-form-container, .contact-info-container { background: white; padding: var(--spacing-lg); border-radius: var(--border-radius); box-shadow: var(--shadow-sm); }
.form-group { margin-bottom: 20px; }
.form-group label { display: block; margin-bottom: 5px; font-weight: 500; }
.form-control { width: 100%; padding: 12px; border: 1px solid #ccc; border-radius: 4px; font-family: var(--font-body); }
.form-control:focus { border-color: var(--color-primary); outline: none; }
.w-100 { width: 100%; }
.btn-whatsapp { background: #25D366; color: white; padding: 15px; border: none; border-radius: 4px; font-size: 1.1rem; cursor: pointer; transition: 0.3s; }
.btn-whatsapp:hover:not(:disabled) { background: #128C7E; }
.btn-whatsapp:disabled { opacity: 0.5; cursor: not-allowed; }
.info-items { margin-bottom: var(--spacing-lg); font-size: 1.2rem; line-height: 2; }
.map-container { border-radius: var(--border-radius); overflow: hidden; }
@media (max-width: 768px) { .contact-layout { grid-template-columns: 1fr; } }
`);

console.log('Script 3 done');
