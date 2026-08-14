import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TourService } from '../../core/services/tour.service';
import { Tour, TourItinerary } from '../../core/models/tour.model';

@Component({
  selector: 'app-tour-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-page-container">
      <div class="admin-page-header">
        <div>
          <h2>🗺️ Gestión de Tours</h2>
          <p class="subtitle">Agrega, edita o administra los tours, itinerarios, inclusiones y recomendaciones.</p>
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
                <button class="btn-action edit-btn" (click)="openEditModal(t)" title="Editar tour completo">
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
            <h3>{{ isEditing ? '✏️ Editar Tour Completo' : '➕ Crear Nuevo Tour' }}</h3>
            <button class="modal-close" (click)="closeModal()">✕</button>
          </div>

          <form (ngSubmit)="saveTour()" #tourForm="ngForm" class="modal-body">
            <!-- TAB / SECTION: INFORMACIÓN GENERAL -->
            <div class="section-box">
              <h4 class="section-box-title">📌 Información General</h4>
              
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
                <label>Imagen del Tour (Subir foto desde tu equipo)</label>
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
                <textarea [(ngModel)]="currentTour.fullDescription" name="fullDescription" rows="3" class="form-input" placeholder="Detalles completos de la experiencia..."></textarea>
              </div>
            </div>

            <!-- SECTION: ITINERARIO (PUNTOS A VISITAR) -->
            <div class="section-box">
              <div class="section-box-header">
                <h4>📍 Itinerario (Puntos a Visitar)</h4>
                <button type="button" class="btn-sm-add" (click)="addItineraryStep()">
                  ➕ Agregar Punto
                </button>
              </div>
              <p class="section-sub">Define los horarios e hitos del recorrido.</p>

              <div class="itinerary-list">
                <div *ngFor="let step of currentTour.itinerary; let i = index" class="itinerary-row">
                  <input type="text" [(ngModel)]="step.time" [name]="'step_time_' + i" class="form-input step-time" placeholder="Ej. 09:00">
                  <input type="text" [(ngModel)]="step.icon" [name]="'step_icon_' + i" class="form-input step-icon" placeholder="📍">
                  <input type="text" [(ngModel)]="step.title" [name]="'step_title_' + i" class="form-input step-title" placeholder="Nombre del punto (Ej. Sacsayhuamán)">
                  <button type="button" class="btn-remove" (click)="removeItineraryStep(i)" title="Eliminar punto">🗑️</button>
                </div>
                <div *ngIf="!currentTour.itinerary || currentTour.itinerary.length === 0" class="empty-sub">
                  No hay puntos de itinerario agregados. Haz clic en "Agregar Punto".
                </div>
              </div>
            </div>

            <!-- SECTION: LO QUE INCLUYE Y LO QUE NO -->
            <div class="form-row">
              <!-- INCLUYE -->
              <div class="col-6">
                <div class="section-box">
                  <div class="section-box-header">
                    <h4>✅ Lo que Incluye</h4>
                  </div>
                  
                  <div class="add-inline">
                    <input type="text" [(ngModel)]="newIncludeText" name="newIncludeText" class="form-input" placeholder="Ej. Guía bilingüe" (keyup.enter)="addIncludeItem()">
                    <button type="button" class="btn-sm-add" (click)="addIncludeItem()">➕</button>
                  </div>

                  <ul class="chip-list">
                    <li *ngFor="let item of currentTour.includes; let i = index" class="chip-item chip-green">
                      <span>{{ item }}</span>
                      <button type="button" class="chip-remove" (click)="removeIncludeItem(i)">✕</button>
                    </li>
                  </ul>
                </div>
              </div>

              <!-- NO INCLUYE -->
              <div class="col-6">
                <div class="section-box">
                  <div class="section-box-header">
                    <h4>❌ Lo que NO Incluye</h4>
                  </div>

                  <div class="add-inline">
                    <input type="text" [(ngModel)]="newNotIncludeText" name="newNotIncludeText" class="form-input" placeholder="Ej. Boleto Turístico" (keyup.enter)="addNotIncludeItem()">
                    <button type="button" class="btn-sm-add" (click)="addNotIncludeItem()">➕</button>
                  </div>

                  <ul class="chip-list">
                    <li *ngFor="let item of currentTour.notIncludes; let i = index" class="chip-item chip-red">
                      <span>{{ item }}</span>
                      <button type="button" class="chip-remove" (click)="removeNotIncludeItem(i)">✕</button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <!-- SECTION: RECOMENDACIONES (¿QUÉ LLEVAR?) -->
            <div class="section-box">
              <div class="section-box-header">
                <h4>🎒 Recomendaciones (¿Qué llevar?)</h4>
              </div>

              <div class="add-inline">
                <input type="text" [(ngModel)]="newWhatToBringText" name="newWhatToBringText" class="form-input" placeholder="Ej. Bloqueador solar, calzado cómodo..." (keyup.enter)="addWhatToBringItem()">
                <button type="button" class="btn-sm-add" (click)="addWhatToBringItem()">➕ Agregar</button>
              </div>

              <ul class="chip-list">
                <li *ngFor="let item of currentTour.whatToBring; let i = index" class="chip-item chip-gold">
                  <span>{{ item }}</span>
                  <button type="button" class="chip-remove" (click)="removeWhatToBringItem(i)">✕</button>
                </li>
              </ul>
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
      max-width: 820px;
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
      position: sticky;
      top: 0;
      background: #FFFFFF;
      z-index: 10;
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

    .section-box {
      background: #F8FAFC;
      border-radius: 14px;
      border: 1px solid #E2E8F0;
      padding: 20px;
      margin-bottom: 24px;
    }

    .section-box-title {
      font-family: 'Outfit', sans-serif;
      font-size: 1.1rem;
      margin: 0 0 16px 0;
      color: #0F172A;
    }

    .section-box-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 8px;
    }

    .section-box-header h4 {
      margin: 0;
      font-family: 'Outfit', sans-serif;
      font-size: 1.05rem;
      color: #0F172A;
    }

    .section-sub {
      font-size: 0.85rem;
      color: #64748B;
      margin: 0 0 14px 0;
    }

    .form-row {
      display: flex;
      gap: 16px;
      margin-bottom: 12px;
    }

    .col-4 { flex: 1; }
    .col-6 { flex: 1; }
    .col-8 { flex: 2; }

    .form-group {
      margin-bottom: 14px;
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
      padding: 11px 14px;
      border: 1px solid #CBD5E1;
      border-radius: 10px;
      font-size: 0.95rem;
      background: #FFFFFF;
    }

    .form-input:focus {
      outline: none;
      border-color: #C97F6C;
    }

    /* Itinerary Editor */
    .itinerary-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }

    .itinerary-row {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .step-time { width: 110px; }
    .step-icon { width: 60px; text-align: center; }
    .step-title { flex-grow: 1; }

    .btn-sm-add {
      background: #C97F6C;
      color: white;
      border: none;
      padding: 8px 14px;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 700;
      cursor: pointer;
    }

    .btn-remove {
      background: #FEE2E2;
      color: #DC2626;
      border: none;
      padding: 8px 12px;
      border-radius: 8px;
      cursor: pointer;
    }

    .add-inline {
      display: flex;
      gap: 8px;
      margin-bottom: 12px;
    }

    .chip-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .chip-item {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .chip-green { background: #DCFCE7; color: #166534; border: 1px solid #BBF7D0; }
    .chip-red { background: #FEE2E2; color: #991B1B; border: 1px solid #FCA5A5; }
    .chip-gold { background: #FEF3C7; color: #92400E; border: 1px solid #FDE68A; }

    .chip-remove {
      background: none;
      border: none;
      color: currentColor;
      font-weight: 800;
      cursor: pointer;
      font-size: 0.8rem;
    }

    .empty-sub {
      font-size: 0.85rem;
      color: #94A3B8;
      font-style: italic;
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
      background: #FFFFFF;
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

  newIncludeText = '';
  newNotIncludeText = '';
  newWhatToBringText = '';

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
    if (!this.currentTour.itinerary) this.currentTour.itinerary = [];
    if (!this.currentTour.includes) this.currentTour.includes = [];
    if (!this.currentTour.notIncludes) this.currentTour.notIncludes = [];
    if (!this.currentTour.whatToBring) this.currentTour.whatToBring = [];
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

  // ITINERARY MANAGEMENT
  addItineraryStep() {
    if (!this.currentTour.itinerary) this.currentTour.itinerary = [];
    this.currentTour.itinerary.push({
      time: '09:00',
      title: 'Punto a visitar',
      icon: '📍'
    });
  }

  removeItineraryStep(index: number) {
    if (this.currentTour.itinerary) {
      this.currentTour.itinerary.splice(index, 1);
    }
  }

  // INCLUDES MANAGEMENT
  addIncludeItem() {
    if (!this.newIncludeText.trim()) return;
    if (!this.currentTour.includes) this.currentTour.includes = [];
    this.currentTour.includes.push(this.newIncludeText.trim());
    this.newIncludeText = '';
  }

  removeIncludeItem(index: number) {
    if (this.currentTour.includes) {
      this.currentTour.includes.splice(index, 1);
    }
  }

  // NOT INCLUDES MANAGEMENT
  addNotIncludeItem() {
    if (!this.newNotIncludeText.trim()) return;
    if (!this.currentTour.notIncludes) this.currentTour.notIncludes = [];
    this.currentTour.notIncludes.push(this.newNotIncludeText.trim());
    this.newNotIncludeText = '';
  }

  removeNotIncludeItem(index: number) {
    if (this.currentTour.notIncludes) {
      this.currentTour.notIncludes.splice(index, 1);
    }
  }

  // WHAT TO BRING MANAGEMENT
  addWhatToBringItem() {
    if (!this.newWhatToBringText.trim()) return;
    if (!this.currentTour.whatToBring) this.currentTour.whatToBring = [];
    this.currentTour.whatToBring.push(this.newWhatToBringText.trim());
    this.newWhatToBringText = '';
  }

  removeWhatToBringItem(index: number) {
    if (this.currentTour.whatToBring) {
      this.currentTour.whatToBring.splice(index, 1);
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
      modality: 'Grupo Compartido',
      itinerary: [],
      includes: [],
      notIncludes: [],
      whatToBring: []
    };
  }
}
