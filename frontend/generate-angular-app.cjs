const fs = require('fs');
const path = require('path');

const src = path.join(process.cwd(), 'src');

const dirs = [
  'environments',
  'styles',
  'app/core/services',
  'app/core/models',
  'app/core/guards',
  'app/core/interceptors',
  'app/shared/components/navbar',
  'app/shared/components/footer',
  'app/shared/components/whatsapp-button',
  'app/shared/components/tour-card',
  'app/shared/components/gallery-carousel',
  'app/shared/components/language-selector',
  'app/shared/pipes',
  'app/pages/home',
  'app/pages/tours',
  'app/pages/tour-detail',
  'app/pages/about',
  'app/pages/contact',
  'app/admin/admin-layout',
  'app/admin/login',
  'app/admin/dashboard',
  'app/admin/tour-management',
  'app/admin/settings/palette-selector',
  'app/admin/gallery-management',
  'app/admin/messages',
  'assets/i18n'
];

dirs.forEach(d => {
  fs.mkdirSync(path.join(src, d), { recursive: true });
});

fs.writeFileSync(path.join(src, 'environments', 'environment.ts'), "export const environment = {\\n  production: false,\\n  apiUrl: 'http://localhost:5000/api'\\n};\\n");
fs.writeFileSync(path.join(src, 'environments', 'environment.prod.ts'), "export const environment = {\\n  production: true,\\n  apiUrl: '/api'\\n};\\n");

function createComponent(pathStr, name, template, css) {
  const className = name.replace(/-./g, x => x[1].toUpperCase())[0].toUpperCase() + name.replace(/-./g, x => x[1].toUpperCase()).slice(1) + "Component";
  fs.writeFileSync(path.join(src, pathStr, name + '.component.ts'), "import { Component } from '@angular/core';\\n@Component({selector: 'app-" + name + "', standalone: true, templateUrl: './" + name + ".component.html', styleUrls: ['./" + name + ".component.css']})\\nexport class " + className + " {}\\n");
  fs.writeFileSync(path.join(src, pathStr, name + '.component.html'), template || "<p>" + name + " works!</p>");
  fs.writeFileSync(path.join(src, pathStr, name + '.component.css'), css || "");
}

createComponent('app/shared/components/navbar', 'navbar', '<nav class="navbar"><div class="logo">MaxisTravel</div></nav>', '.navbar { padding: var(--spacing-md); background: var(--color-primary); color: white; }');
createComponent('app/shared/components/footer', 'footer', '<footer class="footer"><p>© 2024 MaxisTravel</p></footer>', '.footer { padding: var(--spacing-lg); background: var(--color-dark); color: white; text-align: center; }');
createComponent('app/pages/home', 'home', '<div class="home-hero"><h1>{{ "hero.title" | translate }}</h1></div>', '.home-hero { height: 100vh; background: var(--color-primary); }');
createComponent('app/pages/tours', 'tours', '<h2>Tours</h2>', '');
createComponent('app/pages/about', 'about', '<h2>Nosotros</h2>', '');
createComponent('app/pages/contact', 'contact', '<h2>Contacto</h2>', '');
createComponent('app/admin/admin-layout', 'admin-layout', '<router-outlet></router-outlet>', '');

fs.writeFileSync(path.join(src, 'app', 'app.routes.ts'), "import { Routes } from '@angular/router';\\nimport { HomeComponent } from './pages/home/home.component';\\nimport { ToursComponent } from './pages/tours/tours.component';\\nimport { AboutComponent } from './pages/about/about.component';\\nimport { ContactComponent } from './pages/contact/contact.component';\\nimport { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';\\nexport const routes: Routes = [\\n  { path: '', component: HomeComponent },\\n  { path: 'tours', component: ToursComponent },\\n  { path: 'nosotros', component: AboutComponent },\\n  { path: 'contacto', component: ContactComponent },\\n  { path: 'admin', component: AdminLayoutComponent }\\n];\\n");

console.log('Done.');
