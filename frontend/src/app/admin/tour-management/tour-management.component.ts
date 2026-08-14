import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TourService } from '../../core/services/tour.service';
import { Tour } from '../../core/models/tour.model';

@Component({
  selector: 'app-tour-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-page-container">
      <div class="admin-page-header">
        <div>
          <h2>🗺️ Gestión de Tours</h2>
          <p class="subtitle">Agrega, edita o administra los tours disponibles en el sitio público.</p>
        </div>
        <button class="btn btn-primary" (click)="openCreateModal()">
          <span>➕ Nuevo Tour</span>
        </button>
      </div>

      <!-- Filter / Search bar -->
      <div class="filter-bar">
        <input 
          type="text" 
          placeholder="🔍 Buscar tour por nombre..." 
          [(ngModel)]="searchQuery" 
          (input)="applySearch()"
          class="search-input">
        <span class="tour-count">Total: {{ filteredTours.length }} tours</span>
      </div>

      <!-- Tours Table -->
      <div class="table-card">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre del Tour</th>
              <th>Tipo</th>
              <th>Precio</th>
              <th>Duración</th>
              <th>Estado</th>
              <th class="text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let t of filteredTours">
              <td class="img-td">
                <img [src]="t.imageUrl || 'assets/images/logo.jpeg'" [alt]="t.name" class="table-img">
              </td>
              <td class="name-td">
                <strong>{{ t.name }}</strong>
                <span class="slug-text">/tours/{{ t.slug }}</span>
              </td>
              <td><span class="type-pill">{{ t.type }}</span></td>
              <td><strong class="price-text">US$ {{ t.price }}</strong></td>
              <td>{{ t.duration }}</td>
              <td>
                <button 
                  class="badge-btn" 
                  [class.published]="t.isPublished" 
                  [class.draft]="!t.isPublished"
                  (click)="togglePublish(t)"
                  [title]="t.isPublished ? 'Haz clic para cambiar a borrador' : 'Haz clic para publicar'">
                  {{ t.isPublished ? 'Publicado' : 'Borrador' }}
                </button>
              </td>
              <td class="text-right actions-td">
                <button class="btn-action edit-btn" (click)="openEditModal(t)" title="Editar tour">
                  ✏️ Editar
                </button>
                <button class="btn-action delete-btn" (click)="deleteTour(t)" title="Eliminar tour">
                  🗑️
                </button>
              </td>
            </tr>
            <tr *ngIf="filteredTours.length === 0">
              <td colspan="7" class="empty-cell">No se encontraron tours registrados.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- CREATE / EDIT MODAL -->
      <div class="modal-overlay" *ngIf="modalOpen" (click)="closeModal()">
        <div class="modal-card" (click)="$event.stopPropagation()">
          <div class="modal-header">
            <h3>{{ isEditing ? '✏️ Editar Tour' : '➕ Crear Nuevo Tour' }}</h3>
            <button class="modal-close" (click)="closeModal()">✕</button>
          </div>

          <form (ngSubmit)="saveTour()" #tourForm="ngForm" class="modal-body">
            <div class="form-row">
              <div class="form-group col-8">
                <label>Nombre del Tour *</label>
                <input type="text" [(ngModel)]="currentTour.name" name="name" required class="form-input" placeholder="Ej. Tour Valle Sagrado Vip">
              </div>
              <div class="form-group col-4">
                <label>Precio (US$) *</label>
                <input type="number" [(ngModel)]="currentTour.price" name="price" required class="form-input" placeholder="50">
              </div>
            </div>

            <div class="form-row">
              <div class="form-group col-4">
                <label>Duración *</label>
                <input type="text" [(ngModel)]="currentTour.duration" name="duration" required class="form-input" placeholder="Full Day / 4h">
              </div>
              <div class="form-group col-4">
                <label>Dificultad</label>
                <select [(ngModel)]="currentTour.difficulty" name="difficulty" class="form-input">
                  <option value="Fácil">Fácil</option>
                  <option value="Moderada">Moderada</option>
                  <option value="Moderada-Exigente">Moderada-Exigente</option>
                  <option value="Exigente">Exigente</option>
                </select>
              </div>
              <div class="form-group col-4">
                <label>Tipo</label>
                <select [(ngModel)]="currentTour.type" name="type" class="form-input">
                  <option value="Cultural">Cultural</option>
                  <option value="Aventura">Aventura</option>
                  <option value="Naturaleza">Naturaleza</option>
                </select>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group col-4">
                <label>Altitud Máxima</label>
                <input type="text" [(ngModel)]="currentTour.altitude" name="altitude" class="form-input" placeholder="Ej. 4,200 msnm">
              </div>
              <div class="form-group col-4">
                <label>Horario</label>
                <input type="text" [(ngModel)]="currentTour.schedule" name="schedule" class="form-input" placeholder="Ej. 06:30 - 18:00">
              </div>
              <div class="form-group col-4">
                <label>Modalidad</label>
                <select [(ngModel)]="currentTour.modality" name="modality" class="form-input">
                  <option value="Grupo Compartido">Grupo Compartido</option>
                  <option value="Tour Privado">Tour Privado</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label>Imagen del Tour (Subir desde equipo o ingresar URL)</label>
              <div class="image-upload-box">
                <input 
                  type="file" 
                  accept="image/*" 
                  #tourFileInput 
                  (change)="onTourImageSelected($event)" 
                  style="display: none">
                <div class="upload-dropzone" (click)="tourFileInput.click()">
                  <img [src]="currentTour.imageUrl || 'assets/images/logo.jpeg'" class="preview-img">
                  <div class="upload-prompt">
                    <span>📁 Haz clic para subir foto desde tu equipo</span>
                    <span class="upload-sub">Formatos soportados: JPG, PNG, WEBP</span>
                  </div>
                </div>
                <input type="text" [(ngModel)]="currentTour.imageUrl" name="imageUrl" class="form-input mt-2" placeholder="O pega una URL/ruta de imagen">
              </div>
            </div>

            <div class="form-group">
              <label>Descripción Corta *</label>
              <textarea [(ngModel)]="currentTour.description" name="description" required rows="2" class="form-input" placeholder="Resumen breve para tarjetas..."></textarea>
            </div>

            <div class="form-group">
              <label>Descripción Detallada</label>
              <textarea [(ngModel)]="currentTour.fullDescription" name="fullDescription" rows="4" class="form-input" placeholder="Detalles completos del itinerario y experiencia..."></textarea>
            </div>

            <div class="form-group checkbox-group">
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="currentTour.isPublished" name="isPublished">
                <span>Publicar inmediatamente en el sitio público</span>
              </label>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn-cancel" (click)="closeModal()">Cancelar</button>
              <button type="submit" [disabled]="!tourForm.form.valid" class="btn btn-primary">
                {{ isEditing ? 'Guardar Cambios' : 'Crear Tour' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-page-container {
      padding: 30px;
      font-family: 'DM Sans', sans-serif;
    }

    .admin-page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .admin-page-header h2 {
      font-family: 'Outfit', sans-serif;
      font-size: 1.8rem;
      color: #1A1A2E;
      margin: 0 0 6px 0;
    }

    .subtitle {
      color: #64748B;
      font-size: 0.95rem;
      margin: 0;
    }

    .filter-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      gap: 16px;
    }

    .search-input {
      flex-grow: 1;
      max-width: 400px;
      padding: 12px 18px;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      font-size: 0.95rem;
      background: #FFFFFF;
      box-shadow: 0 2px 6px rgba(0,0,0,0.02);
    }

    .search-input:focus {
      outline: none;
      border-color: #C97F6C;
    }

    .tour-count {
      font-weight: 600;
      color: #64748B;
      font-size: 0.9rem;
    }

    .table-card {
      background: #FFFFFF;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
      border: 1px solid #E2E8F0;
      overflow: hidden;
    }

    .admin-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }

    .admin-table th {
      background: #F8FAFC;
      padding: 16px 20px;
      font-size: 0.85rem;
      font-weight: 700;
      color: #475569;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid #E2E8F0;
    }

    .admin-table td {
      padding: 16px 20px;
      border-bottom: 1px solid #F1F5F9;
      vertical-align: middle;
      font-size: 0.95rem;
      color: #334155;
    }

    .img-td { width: 70px; }
    .table-img {
      width: 50px;
      height: 50px;
      border-radius: 10px;
      object-fit: cover;
    }

    .name-td {
      display: flex;
      flex-direction: column;
    }

    .slug-text {
      font-size: 0.8rem;
      color: #94A3B8;
    }

    .type-pill {
      background: #F1F5F9;
      color: #475569;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
    }

    .price-text {
      color: #C26148;
    }

    .badge-btn {
      border: none;
      padding: 6px 14px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .badge-btn.published {
      background: #DCFCE7;
      color: #15803D;
    }

    .badge-btn.published:hover {
      background: #BBF7D0;
    }

    .badge-btn.draft {
      background: #F1F5F9;
      color: #64748B;
    }

    .badge-btn.draft:hover {
      background: #E2E8F0;
    }

    .actions-td {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }

    .btn-action {
      border: none;
      padding: 8px 14px;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .edit-btn {
      background: #EFF6FF;
      color: #1D4ED8;
    }
    .edit-btn:hover { background: #DBEAFE; }

    .delete-btn {
      background: #FEF2F2;
      color: #DC2626;
    }
    .delete-btn:hover { background: #FEE2E2; }

    .empty-cell {
      text-align: center;
      padding: 40px;
      color: #94A3B8;
    }

    .btn-primary {
      background: linear-gradient(135deg, #C97F6C 0%, #C26148 100%);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 12px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(201, 127, 108, 0.3);
      transition: all 0.2s ease;
    }
    .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(201, 127, 108, 0.4); }

    /* Modal Styles */
    .modal-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(15, 23, 42, 0.6);
      backdrop-filter: blur(4px);
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }

    .modal-card {
      background: #FFFFFF;
      border-radius: 20px;
      width: 100%;
      max-width: 750px;
      max-height: 90vh;
      overflow-y: auto;
      box-shadow: 0 25px 50px rgba(0,0,0,0.25);
    }

    .modal-header {
      padding: 20px 28px;
      border-bottom: 1px solid #E2E8F0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .modal-header h3 {
      margin: 0;
      font-family: 'Outfit', sans-serif;
      color: #1A1A2E;
    }

    .modal-close {
      background: none;
      border: none;
      font-size: 1.4rem;
      cursor: pointer;
      color: #64748B;
    }

    .modal-body {
      padding: 28px;
    }

    .form-row {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
    }

    .col-4 { flex: 1; }
    .col-8 { flex: 2; }

    .form-group {
      margin-bottom: 16px;
      display: flex;
      flex-direction: column;
    }

    .form-group label {
      font-weight: 600;
      font-size: 0.85rem;
      color: #475569;
      margin-bottom: 6px;
    }

    .form-input {
      padding: 12px 14px;
      border: 1px solid #CBD5E1;
      border-radius: 10px;
      font-size: 0.95rem;
      background: #F8FAFC;
    }

    .form-input:focus {
      outline: none;
      border-color: #C97F6C;
      background: #FFFFFF;
    }

    .checkbox-group {
      margin-top: 10px;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      font-weight: 600;
      color: #334155;
    }

    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid #E2E8F0;
    }

    .btn-cancel {
      background: #F1F5F9;
      color: #475569;
      border: none;
      padding: 12px 20px;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
    }

    .upload-dropzone {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px;
      background: #F8FAFC;
      border: 2px dashed #CBD5E1;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    .upload-dropzone:hover {
      border-color: #C97F6C;
      background: #FFF8F5;
    }
    .preview-img {
      width: 70px;
      height: 70px;
      border-radius: 10px;
      object-fit: cover;
      border: 1px solid #E2E8F0;
    }
    .upload-prompt {
      display: flex;
      flex-direction: column;
      font-size: 0.9rem;
      font-weight: 600;
      color: #334155;
    }
    .upload-sub {
      font-size: 0.8rem;
      color: #94A3B8;
      font-weight: 400;
    }
    .mt-2 { margin-top: 8px; }
  `]
})
export class TourManagementComponent implements OnInit {
  tours: Tour[] = [];
  filteredTours: Tour[] = [];
  searchQuery = '';

  modalOpen = false;
  isEditing = false;
  currentTour: Tour = this.getEmptyTour();

  constructor(private tourService: TourService) {}

  ngOnInit() {
    this.loadTours();
  }

  loadTours() {
    this.tourService.getAllToursAdmin().subscribe(t => {
      this.tours = t;
      this.applySearch();
    });
  }

  applySearch() {
    if (!this.searchQuery) {
      this.filteredTours = [...this.tours];
    } else {
      const query = this.searchQuery.toLowerCase();
      this.filteredTours = this.tours.filter(t => t.name.toLowerCase().includes(query));
    }
  }

  openCreateModal() {
    this.isEditing = false;
    this.currentTour = this.getEmptyTour();
    this.modalOpen = true;
  }

  openEditModal(tour: Tour) {
    this.isEditing = true;
    this.currentTour = JSON.parse(JSON.stringify(tour)); // deep clone
    this.modalOpen = true;
  }

  closeModal() {
    this.modalOpen = false;
  }

  saveTour() {
    if (this.isEditing && this.currentTour.id) {
      this.tourService.updateTour(this.currentTour.id, this.currentTour).subscribe(() => {
        this.loadTours();
        this.closeModal();
      });
    } else {
      this.tourService.addTour(this.currentTour).subscribe(() => {
        this.loadTours();
        this.closeModal();
      });
    }
  }

  togglePublish(tour: Tour) {
    if (tour.id) {
      this.tourService.togglePublish(tour.id).subscribe(() => {
        this.loadTours();
      });
    }
  }

  deleteTour(tour: Tour) {
    if (confirm(`¿Estás seguro de eliminar el tour "${tour.name}"?`)) {
      if (tour.id) {
        this.tourService.deleteTour(tour.id).subscribe(() => {
          this.loadTours();
        });
      }
    }
  }

  onTourImageSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.currentTour.imageUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  private getEmptyTour(): Tour {
    return {
      slug: '',
      name: '',
      price: 40,
      description: '',
      fullDescription: '',
      duration: 'Full Day',
      difficulty: 'Fácil',
      type: 'Cultural',
      isPublished: true,
      imageUrl: 'assets/images/tours/city-tour/city-tour-001.jpeg',
      altitude: '',
      schedule: '',
      modality: 'Grupo Compartido'
    };
  }
}
