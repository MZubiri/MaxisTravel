const fs = require('fs');
const path = require('path');
const src = path.join(process.cwd(), 'src');
const write = (p, c) => {
  const fp = path.join(src, p);
  fs.mkdirSync(path.dirname(fp), {recursive: true});
  fs.writeFileSync(fp, c.trim() + '\n', 'utf8');
};

write('app/admin/admin-layout/admin-layout.component.ts', `
import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterModule],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent {}
`);
write('app/admin/admin-layout/admin-layout.component.html', `
<div class="admin-wrapper">
  <aside class="admin-sidebar">
    <div class="admin-logo">MaxisTravel Admin</div>
    <nav class="admin-nav">
      <a routerLink="/admin/dashboard" routerLinkActive="active">📊 Dashboard</a>
      <a routerLink="/admin/tours" routerLinkActive="active">🗺️ Tours</a>
      <a routerLink="/admin/paleta" routerLinkActive="active">🎨 Paleta</a>
    </nav>
  </aside>
  <div class="admin-main">
    <header class="admin-topbar">
      <span>Bienvenido, Admin</span>
      <a routerLink="/" class="btn-logout">Salir al sitio web</a>
    </header>
    <div class="admin-content"><router-outlet></router-outlet></div>
  </div>
</div>
`);
write('app/admin/admin-layout/admin-layout.component.css', `
.admin-wrapper { display: flex; min-height: 100vh; background: #f4f6f9; }
.admin-sidebar { width: 250px; background: #1a1a2e; color: white; display: flex; flex-direction: column; }
.admin-logo { padding: 20px; font-size: 1.5rem; font-weight: bold; border-bottom: 1px solid rgba(255,255,255,0.1); }
.admin-nav { display: flex; flex-direction: column; padding: 20px 0; }
.admin-nav a { color: #aaa; text-decoration: none; padding: 15px 20px; transition: 0.3s; }
.admin-nav a:hover, .admin-nav a.active { color: white; background: rgba(255,255,255,0.1); border-left: 4px solid var(--color-accent); }
.admin-main { flex: 1; display: flex; flex-direction: column; }
.admin-topbar { background: white; padding: 15px 30px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
.btn-logout { background: #e74c3c; color: white; padding: 8px 15px; border-radius: 4px; text-decoration: none; font-size: 0.9rem; }
.admin-content { padding: 30px; overflow-y: auto; }
`);

write('app/admin/dashboard/dashboard.component.ts', `
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
@Component({ selector: 'app-dashboard', standalone: true, imports: [RouterModule], template: \`
  <h1>Panel de Administración</h1>
  <div class="stat-grid">
    <div class="stat-card"><h3>5</h3><p>Tours Activos</p></div>
    <div class="stat-card"><h3>0</h3><p>Mensajes sin leer</p></div>
    <div class="stat-card"><h3>Hera</h3><p>Paleta Activa</p></div>
  </div>
  <div class="quick-actions">
    <a routerLink="/admin/tours" class="admin-btn">Gestionar Tours</a>
  </div>
\`, styles: [\`
  h1 { margin-bottom: 20px; }
  .stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px; }
  .stat-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center; }
  .stat-card h3 { font-size: 2.5rem; color: #1a1a2e; }
  .admin-btn { display: inline-block; background: var(--color-primary); color: white; padding: 10px 20px; border-radius: 4px; text-decoration: none; }
\`]})
export class DashboardComponent {}
`);

write('app/admin/settings/palette-selector/palette-selector.component.ts', `
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/services/theme.service';

@Component({ selector: 'app-palette-selector', standalone: true, imports: [CommonModule], template: \`
  <h2>Paleta de Colores</h2>
  <div class="palette-grid">
    <div class="palette-card" [class.active]="theme.activePalette().id === 'hera'">
      <h3>Hera</h3>
      <div class="colors"><div class="c" style="background:#C97F6C"></div><div class="c" style="background:#C26148"></div><div class="c" style="background:#D6AA5C"></div></div>
      <button (click)="theme.switchPalette('hera')">Activar</button>
    </div>
    <div class="palette-card" [class.active]="theme.activePalette().id === 'persefone'">
      <h3>Perséfone</h3>
      <div class="colors"><div class="c" style="background:#04474B"></div><div class="c" style="background:#D3B9B9"></div><div class="c" style="background:#E4981E"></div></div>
      <button (click)="theme.switchPalette('persefone')">Activar</button>
    </div>
  </div>
\`, styles: [\`
  .palette-grid { display: flex; gap: 20px; }
  .palette-card { background: white; padding: 20px; border-radius: 8px; border: 2px solid transparent; width: 250px; text-align: center; }
  .palette-card.active { border-color: var(--color-primary); }
  .colors { display: flex; justify-content: center; gap: 10px; margin: 15px 0; }
  .c { width: 30px; height: 30px; border-radius: 50%; }
  button { background: var(--color-primary); color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer; }
\`]})
export class PaletteSelectorComponent {
  constructor(public theme: ThemeService) {}
}
`);

write('app/admin/tour-management/tour-management.component.ts', `
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourService } from '../../core/services/tour.service';

@Component({ selector: 'app-tour-management', standalone: true, imports: [CommonModule], template: \`
  <div class="header"><h2>Gestión de Tours</h2> <button class="btn">Nuevo Tour</button></div>
  <table class="admin-table">
    <thead><tr><th>Tour</th><th>Precio</th><th>Duración</th><th>Estado</th><th>Acciones</th></tr></thead>
    <tbody>
      <tr *ngFor="let t of tours">
        <td>{{t.name}}</td><td>\${{t.price}}</td><td>{{t.duration}}</td>
        <td><span class="badge" [class.pub]="t.isPublished">Publicado</span></td>
        <td><button class="btn-sm">Editar</button></td>
      </tr>
    </tbody>
  </table>
\`, styles: [\`
  .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
  .btn { background: var(--color-primary); color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; }
  .btn-sm { background: #555; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; }
  .admin-table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; }
  .admin-table th, .admin-table td { padding: 12px 15px; text-align: left; border-bottom: 1px solid #eee; }
  .admin-table th { background: #f8f9fa; }
  .badge { padding: 4px 8px; border-radius: 12px; font-size: 0.8rem; background: #ddd; color: #333; }
  .badge.pub { background: #d4edda; color: #155724; }
\`]})
export class TourManagementComponent {
  tours: any[] = [];
  constructor(private tourService: TourService) { this.tourService.getTours().subscribe(t => this.tours = t); }
}
`);
console.log('Script 4 done');
