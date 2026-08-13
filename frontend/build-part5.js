const fs = require('fs');
const path = require('path');
const src = path.join(process.cwd(), 'src');
const write = (p, c) => {
  const fp = path.join(src, p);
  fs.mkdirSync(path.dirname(fp), {recursive: true});
  fs.writeFileSync(fp, c.trim() + '\n', 'utf8');
};

write('app/app.routes.ts', `
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ToursComponent } from './pages/tours/tours.component';
import { TourDetailComponent } from './pages/tour-detail/tour-detail.component';
import { AboutComponent } from './pages/about/about.component';
import { ContactComponent } from './pages/contact/contact.component';
import { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { TourManagementComponent } from './admin/tour-management/tour-management.component';
import { PaletteSelectorComponent } from './admin/settings/palette-selector/palette-selector.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'tours', component: ToursComponent },
  { path: 'tours/:slug', component: TourDetailComponent },
  { path: 'nosotros', component: AboutComponent },
  { path: 'contacto', component: ContactComponent },
  { 
    path: 'admin', 
    component: AdminLayoutComponent,
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'tours', component: TourManagementComponent },
      { path: 'paleta', component: PaletteSelectorComponent }
    ]
  }
];
`);

write('index.html', `
<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <title>MaxisTravel - Transporte & Turismo | Tours en Cusco, Perú</title>
  <base href="/">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="description" content="Agencia de turismo en Cusco, Perú. Ofrecemos experiencias únicas para descubrir la magia del Imperio Inca.">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
</head>
<body>
  <app-root></app-root>
</body>
</html>
`);

write('assets/i18n/es.json', `
{
  "nav": { "home": "Inicio", "tours": "Tours", "about": "Nosotros", "contact": "Contacto" },
  "hero": { "title": "Descubre la Magia del Cusco", "subtitle": "Experiencias únicas en la capital del Imperio Inca", "cta_tours": "Explorar Tours", "cta_whatsapp": "Contactar por WhatsApp" },
  "tours": { "title": "Nuestros Tours", "view_all": "Ver todos los tours", "filter_all": "Todos", "filter_cultural": "Cultural", "filter_adventure": "Aventura", "filter_nature": "Naturaleza", "from": "Desde", "per_person": "por persona", "details": "Ver detalles", "book": "Reservar" },
  "tour_detail": { "about": "Sobre este tour", "itinerary": "Itinerario", "includes": "Incluye", "not_includes": "No incluye", "what_to_bring": "¿Qué llevar?", "book_whatsapp": "Reservar por WhatsApp", "from": "Desde", "per_person": "por persona", "related": "Tours relacionados" },
  "footer": { "description": "Agencia de turismo en Cusco, Perú. Ofrecemos experiencias únicas para descubrir la magia del Imperio Inca.", "links": "Enlaces rápidos", "contact": "Contacto", "rights": "© 2024 MaxisTravel. Todos los derechos reservados." }
}
`);

write('assets/i18n/en.json', `
{
  "nav": { "home": "Home", "tours": "Tours", "about": "About Us", "contact": "Contact" },
  "hero": { "title": "Discover the Magic of Cusco", "subtitle": "Unique experiences in the capital of the Inca Empire", "cta_tours": "Explore Tours", "cta_whatsapp": "Contact via WhatsApp" },
  "tours": { "title": "Our Tours", "view_all": "View all tours", "filter_all": "All", "filter_cultural": "Cultural", "filter_adventure": "Adventure", "filter_nature": "Nature", "from": "From", "per_person": "per person", "details": "View details", "book": "Book now" },
  "tour_detail": { "about": "About this tour", "itinerary": "Itinerary", "includes": "Includes", "not_includes": "Not included", "what_to_bring": "What to bring?", "book_whatsapp": "Book via WhatsApp", "from": "From", "per_person": "per person", "related": "Related tours" },
  "footer": { "description": "Tourism agency in Cusco, Peru. We offer unique experiences to discover the magic of the Inca Empire.", "links": "Quick links", "contact": "Contact", "rights": "© 2024 MaxisTravel. All rights reserved." }
}
`);
console.log('Script 5 done');
