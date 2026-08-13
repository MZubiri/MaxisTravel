import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
@Component({ selector: 'app-dashboard', standalone: true, imports: [RouterModule], template: `
  <h1>Panel de Administración</h1>
  <div class="stat-grid">
    <div class="stat-card"><h3>5</h3><p>Tours Activos</p></div>
    <div class="stat-card"><h3>0</h3><p>Mensajes sin leer</p></div>
    <div class="stat-card"><h3>Hera</h3><p>Paleta Activa</p></div>
  </div>
  <div class="quick-actions">
    <a routerLink="/admin/tours" class="admin-btn">Gestionar Tours</a>
  </div>
`, styles: [`
  h1 { margin-bottom: 20px; }
  .stat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 30px; }
  .stat-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center; }
  .stat-card h3 { font-size: 2.5rem; color: #1a1a2e; }
  .admin-btn { display: inline-block; background: var(--color-primary); color: white; padding: 10px 20px; border-radius: 4px; text-decoration: none; }
`]})
export class DashboardComponent {}
