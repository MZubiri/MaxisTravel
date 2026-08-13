import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TourService } from '../../core/services/tour.service';

@Component({ selector: 'app-tour-management', standalone: true, imports: [CommonModule], template: `
  <div class="header"><h2>Gestión de Tours</h2> <button class="btn">Nuevo Tour</button></div>
  <table class="admin-table">
    <thead><tr><th>Tour</th><th>Precio</th><th>Duración</th><th>Estado</th><th>Acciones</th></tr></thead>
    <tbody>
      <tr *ngFor="let t of tours">
        <td>{{t.name}}</td><td>$ {{t.price}}</td><td>{{t.duration}}</td>
        <td><span class="badge" [class.pub]="t.isPublished">Publicado</span></td>
        <td><button class="btn-sm">Editar</button></td>
      </tr>
    </tbody>
  </table>
`, styles: [`
  .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
  .btn { background: var(--color-primary); color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; }
  .btn-sm { background: #555; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer; }
  .admin-table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; }
  .admin-table th, .admin-table td { padding: 12px 15px; text-align: left; border-bottom: 1px solid #eee; }
  .admin-table th { background: #f8f9fa; }
  .badge { padding: 4px 8px; border-radius: 12px; font-size: 0.8rem; background: #ddd; color: #333; }
  .badge.pub { background: #d4edda; color: #155724; }
`]})
export class TourManagementComponent {
  tours: any[] = [];
  constructor(private tourService: TourService) { this.tourService.getTours().subscribe(t => this.tours = t); }
}
