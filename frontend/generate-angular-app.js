import * as fs from 'fs';
import * as path from 'path';

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

// Environment files
fs.writeFileSync(path.join(src, 'environments', 'environment.ts'), `export const environment = {\n  production: false,\n  apiUrl: 'http://localhost:5000/api'\n};\n`);
fs.writeFileSync(path.join(src, 'environments', 'environment.prod.ts'), `export const environment = {\n  production: true,\n  apiUrl: '/api'\n};\n`);

// Global Styles
fs.writeFileSync(path.join(src, 'styles', '_variables.css'), `:root {\n  --color-primary: #C97F6C;\n  --color-secondary: #C26148;\n  --color-accent: #D6AA5C;\n  --color-light: #EDDEE0;\n  --color-dark: #3D2B1F;\n  --color-bg: #FFF8F5;\n  --font-heading: 'Outfit', sans-serif;\n  --font-body: 'DM Sans', sans-serif;\n  --spacing-sm: 8px;\n  --spacing-md: 16px;\n  --spacing-lg: 32px;\n  --spacing-xl: 64px;\n  --border-radius: 8px;\n  --shadow-sm: 0 2px 4px rgba(0,0,0,0.1);\n  --shadow-md: 0 4px 8px rgba(0,0,0,0.15);\n  --transition: all 0.3s ease;\n}\n`);
fs.writeFileSync(path.join(src, 'styles', '_typography.css'), `@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Outfit:wght@400;500;600;700&display=swap');\nbody { font-family: var(--font-body); color: var(--color-dark); }\nh1, h2, h3, h4, h5, h6 { font-family: var(--font-heading); }\n`);
fs.writeFileSync(path.join(src, 'styles', '_animations.css'), `@keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }\n@keyframes pulse { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }\n.fade-in-up { animation: fadeInUp 0.5s ease forwards; }\n`);
fs.writeFileSync(path.join(src, 'styles', '_andean-theme.css'), `.andean-divider { height: 20px; background-image: repeating-linear-gradient(45deg, var(--color-primary) 25%, transparent 25%, transparent 75%, var(--color-primary) 75%, var(--color-primary)), repeating-linear-gradient(45deg, var(--color-primary) 25%, var(--color-bg) 25%, var(--color-bg) 75%, var(--color-primary) 75%, var(--color-primary)); background-position: 0 0, 10px 10px; background-size: 20px 20px; }\n.inca-border { border: 2px solid var(--color-primary); border-radius: var(--border-radius); }\n`);
fs.writeFileSync(path.join(src, 'styles.css'), `@import './styles/_variables.css';\n@import './styles/_typography.css';\n@import './styles/_animations.css';\n@import './styles/_andean-theme.css';\n* { box-sizing: border-box; margin: 0; padding: 0; }\nbody { background-color: var(--color-bg); overflow-x: hidden; }\n`);

// Models
const tourModel = `export interface Tour { id?: string; slug: string; name: string; price: number; description: string; duration: string; difficulty: string; type: string; isPublished: boolean; imageUrl?: string; }\n`;
fs.writeFileSync(path.join(src, 'app/core/models', 'tour.model.ts'), tourModel);
const settingsModel = `export interface ColorPalette { id: string; name: string; primary: string; secondary: string; accent: string; light: string; dark: string; bg: string; }\nexport interface SiteSettings { whatsappNumber: string; }\n`;
fs.writeFileSync(path.join(src, 'app/core/models', 'settings.model.ts'), settingsModel);

// Services
const themeService = `import { Injectable, signal } from '@angular/core';\nimport { ColorPalette } from '../models/settings.model';\n@Injectable({providedIn: 'root'})\nexport class ThemeService {\n  private palettes: Record<string, ColorPalette> = {\n    hera: { id: 'hera', name: 'Hera', primary: '#C97F6C', secondary: '#C26148', accent: '#D6AA5C', light: '#EDDEE0', dark: '#3D2B1F', bg: '#FFF8F5' },\n    persefone: { id: 'persefone', name: 'Perséfone', primary: '#04474B', secondary: '#D3B9B9', accent: '#E4981E', light: '#E7E7E5', dark: '#022D30', bg: '#F2F2F2' }\n  };\n  activePalette = signal<ColorPalette>(this.palettes['hera']);\n  loadTheme() { this.applyPalette(this.palettes['hera']); }\n  switchPalette(id: string) { if(this.palettes[id]) { this.activePalette.set(this.palettes[id]); this.applyPalette(this.palettes[id]); } }\n  private applyPalette(p: ColorPalette) { const root = document.documentElement; root.style.setProperty('--color-primary', p.primary); root.style.setProperty('--color-secondary', p.secondary); root.style.setProperty('--color-accent', p.accent); root.style.setProperty('--color-light', p.light); root.style.setProperty('--color-dark', p.dark); root.style.setProperty('--color-bg', p.bg); }\n}\n`;
fs.writeFileSync(path.join(src, 'app/core/services', 'theme.service.ts'), themeService);

const i18nService = `import { Injectable, signal } from '@angular/core';\nimport { HttpClient } from '@angular/common/http';\n@Injectable({providedIn: 'root'})\nexport class I18nService {\n  currentLang = signal<string>('es');\n  translations = signal<any>({});\n  constructor(private http: HttpClient) { this.loadTranslations('es'); }\n  setLanguage(lang: string) { this.currentLang.set(lang); this.loadTranslations(lang); }\n  private loadTranslations(lang: string) { this.http.get(\`assets/i18n/\${lang}.json\`).subscribe(data => this.translations.set(data)); }\n  translate(key: string): string { const keys = key.split('.'); let val = this.translations(); for(const k of keys) { if(val) val = val[k]; else break; } return val || key; }\n}\n`;
fs.writeFileSync(path.join(src, 'app/core/services', 'i18n.service.ts'), i18nService);

// Pipes
const translatePipe = `import { Pipe, PipeTransform } from '@angular/core';\nimport { I18nService } from '../../core/services/i18n.service';\n@Pipe({name: 'translate', standalone: true, pure: false})\nexport class TranslatePipe implements PipeTransform {\n  constructor(private i18n: I18nService) {}\n  transform(value: string): string { return this.i18n.translate(value); }\n}\n`;
fs.writeFileSync(path.join(src, 'app/shared/pipes', 'translate.pipe.ts'), translatePipe);

// Components (Stub)
function createComponent(pathStr, name, template = '', css = '') {
  fs.writeFileSync(path.join(src, pathStr, \`\${name}.component.ts\`), \`import { Component } from '@angular/core';\n@Component({selector: 'app-\${name}', standalone: true, templateUrl: './\${name}.component.html', styleUrls: ['./\${name}.component.css']})\nexport class \${name.replace(/-./g, x=>x[1].toUpperCase())[0].toUpperCase() + name.replace(/-./g, x=>x[1].toUpperCase()).slice(1)}Component {}\n\`);
  fs.writeFileSync(path.join(src, pathStr, \`\${name}.component.html\`), template || \`<p>\${name} works!</p>\`);
  fs.writeFileSync(path.join(src, pathStr, \`\${name}.component.css\`), css);
}

createComponent('app/shared/components/navbar', 'navbar', '<nav class="navbar"><div class="logo">MaxisTravel</div></nav>', '.navbar { padding: var(--spacing-md); background: var(--color-primary); color: white; }');
createComponent('app/shared/components/footer', 'footer', '<footer class="footer"><p>© 2024 MaxisTravel</p></footer>', '.footer { padding: var(--spacing-lg); background: var(--color-dark); color: white; text-align: center; }');
createComponent('app/pages/home', 'home', '<div class="home-hero"><h1>{{ "hero.title" | translate }}</h1></div>', '.home-hero { height: 100vh; background: var(--color-primary); }');
createComponent('app/pages/tours', 'tours', '<h2>Tours</h2>');
createComponent('app/pages/about', 'about', '<h2>Nosotros</h2>');
createComponent('app/pages/contact', 'contact', '<h2>Contacto</h2>');
createComponent('app/admin/admin-layout', 'admin-layout', '<router-outlet></router-outlet>');

// App Config & Component
const appConfig = \`import { ApplicationConfig } from '@angular/core';\nimport { provideRouter } from '@angular/router';\nimport { provideHttpClient } from '@angular/common/http';\nimport { routes } from './app.routes';\nexport const appConfig: ApplicationConfig = { providers: [provideRouter(routes), provideHttpClient()] };\n\`;
fs.writeFileSync(path.join(src, 'app', 'app.config.ts'), appConfig);

const appRoutes = \`import { Routes } from '@angular/router';\nimport { HomeComponent } from './pages/home/home.component';\nimport { ToursComponent } from './pages/tours/tours.component';\nimport { AboutComponent } from './pages/about/about.component';\nimport { ContactComponent } from './pages/contact/contact.component';\nimport { AdminLayoutComponent } from './admin/admin-layout/admin-layout.component';\nexport const routes: Routes = [\n  { path: '', component: HomeComponent },\n  { path: 'tours', component: ToursComponent },\n  { path: 'nosotros', component: AboutComponent },\n  { path: 'contacto', component: ContactComponent },\n  { path: 'admin', component: AdminLayoutComponent }\n];\n\`;
fs.writeFileSync(path.join(src, 'app', 'app.routes.ts'), appRoutes);

const appComponentTs = \`import { Component, OnInit } from '@angular/core';\nimport { RouterOutlet, Router } from '@angular/router';\nimport { ThemeService } from './core/services/theme.service';\nimport { NavbarComponent } from './shared/components/navbar/navbar.component';\nimport { FooterComponent } from './shared/components/footer/footer.component';\nimport { CommonModule } from '@angular/common';\n@Component({selector: 'app-root', standalone: true, imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent], templateUrl: './app.component.html', styleUrl: './app.component.css'})\nexport class AppComponent implements OnInit {\n  isAdmin = false;\n  constructor(private theme: ThemeService, private router: Router) { router.events.subscribe(() => { this.isAdmin = router.url.startsWith('/admin'); }); }\n  ngOnInit() { this.theme.loadTheme(); }\n}\n\`;
fs.writeFileSync(path.join(src, 'app', 'app.component.ts'), appComponentTs);
const appComponentHtml = \`<app-navbar *ngIf="!isAdmin"></app-navbar>\n<router-outlet></router-outlet>\n<app-footer *ngIf="!isAdmin"></app-footer>\n\`;
fs.writeFileSync(path.join(src, 'app', 'app.component.html'), appComponentHtml);

// i18n JSON
fs.writeFileSync(path.join(src, 'assets/i18n', 'es.json'), \`{"hero": {"title": "Descubre la Magia del Cusco"}}\`);
fs.writeFileSync(path.join(src, 'assets/i18n', 'en.json'), \`{"hero": {"title": "Discover the Magic of Cusco"}}\`);

console.log('Project setup complete.');
