import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GalleryService, GalleryPhoto } from '../../core/services/gallery.service';

@Component({
  selector: 'app-gallery-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-page-container">
      <div class="admin-page-header">
        <div>
          <h2>🖼️ Gestión de Galería y Carrusel</h2>
          <p class="subtitle">Sube nuevas fotos desde tu equipo y selecciona cuáles aparecerán en el carrusel de inicio.</p>
        </div>
        <div>
          <input 
            type="file" 
            multiple 
            accept="image/*" 
            #fileInput 
            (change)="onFilesSelected($event)" 
            style="display: none">
          <button class="btn btn-primary" (click)="fileInput.click()">
            <span>📁 Subir Nuevas Fotos</span>
          </button>
        </div>
      </div>

      <!-- Stats Bar -->
      <div class="stats-bar">
        <div class="stat-pill">
          <strong>{{ activeCount }}</strong> / {{ photos.length }} fotos activas en el carrusel
        </div>
        <div class="info-note">
          💡 Haz clic en la casilla de cualquier foto para incluirla o quitarla del carrusel en vivo.
        </div>
      </div>

      <!-- Gallery Grid -->
      <div class="gallery-grid">
        <div 
          *ngFor="let photo of photos" 
          class="gallery-card" 
          [class.in-carousel]="photo.inCarousel">
          <div class="card-img-wrapper">
            <img [src]="photo.url" alt="Foto galería" loading="lazy">
            <div class="badge-active" *ngIf="photo.inCarousel">
              ✨ En Carrusel
            </div>
            <button class="btn-delete-photo" (click)="deletePhoto(photo)" title="Eliminar foto">
              🗑️
            </button>
          </div>
          <div class="card-controls">
            <label class="checkbox-container">
              <input 
                type="checkbox" 
                [checked]="photo.inCarousel" 
                (change)="toggleCarousel(photo)">
              <span class="checkmark"></span>
              <span class="label-text">{{ photo.inCarousel ? 'Mostrar en Carrusel' : 'Ocultar del Carrusel' }}</span>
            </label>
          </div>
        </div>
      </div>

      <div class="empty-gallery" *ngIf="photos.length === 0">
        <p>No hay fotos registradas en la galería. Haz clic en <strong>"Subir Nuevas Fotos"</strong> para comenzar.</p>
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

    .stats-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: #FFFFFF;
      padding: 16px 24px;
      border-radius: 16px;
      margin-bottom: 30px;
      box-shadow: 0 4px 15px rgba(0,0,0,0.03);
      border: 1px solid #E2E8F0;
    }

    .stat-pill {
      font-size: 1.05rem;
      color: #334155;
    }

    .stat-pill strong {
      color: #C26148;
      font-size: 1.3rem;
    }

    .info-note {
      font-size: 0.9rem;
      color: #64748B;
    }

    .gallery-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
      gap: 24px;
    }

    .gallery-card {
      background: #FFFFFF;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0,0,0,0.05);
      border: 2px solid #E2E8F0;
      transition: all 0.3s ease;
    }

    .gallery-card.in-carousel {
      border-color: #C97F6C;
      box-shadow: 0 8px 25px rgba(201, 127, 108, 0.15);
    }

    .card-img-wrapper {
      position: relative;
      height: 180px;
      overflow: hidden;
    }

    .card-img-wrapper img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .badge-active {
      position: absolute;
      top: 10px;
      left: 10px;
      background: rgba(201, 127, 108, 0.9);
      backdrop-filter: blur(4px);
      color: white;
      font-size: 0.75rem;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 20px;
    }

    .btn-delete-photo {
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(239, 68, 68, 0.85);
      border: none;
      color: white;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.2s;
    }

    .btn-delete-photo:hover {
      transform: scale(1.1);
      background: #DC2626;
    }

    .card-controls {
      padding: 14px 16px;
      background: #F8FAFC;
    }

    .checkbox-container {
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      font-size: 0.9rem;
      font-weight: 600;
      color: #334155;
      user-select: none;
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

    .empty-gallery {
      text-align: center;
      padding: 60px;
      background: white;
      border-radius: 16px;
      color: #64748B;
    }
  `]
})
export class GalleryManagementComponent implements OnInit {
  photos: GalleryPhoto[] = [];

  constructor(private galleryService: GalleryService) {}

  ngOnInit() {
    this.loadPhotos();
  }

  loadPhotos() {
    this.galleryService.getAllPhotos().subscribe(p => this.photos = p);
  }

  get activeCount(): number {
    return this.photos.filter(p => p.inCarousel).length;
  }

  toggleCarousel(photo: GalleryPhoto) {
    this.galleryService.toggleCarousel(photo.id).subscribe(() => this.loadPhotos());
  }

  deletePhoto(photo: GalleryPhoto) {
    if (confirm('¿Eliminar esta foto de la galería?')) {
      this.galleryService.deletePhoto(photo.id).subscribe(() => this.loadPhotos());
    }
  }

  onFilesSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    const uploadedUrls: string[] = [];
    let processed = 0;

    fileList.forEach(file => {
      this.galleryService.uploadFile(file).subscribe({
        next: (res) => {
          if (res && res.url) {
            uploadedUrls.push(res.url);
          }
          processed++;
          if (processed === fileList.length) {
            this.finishUpload(uploadedUrls, input);
          }
        },
        error: () => {
          // Fallback to local data URL if backend is offline
          const reader = new FileReader();
          reader.onload = () => {
            uploadedUrls.push(reader.result as string);
            processed++;
            if (processed === fileList.length) {
              this.finishUpload(uploadedUrls, input);
            }
          };
          reader.readAsDataURL(file);
        }
      });
    });
  }

  private finishUpload(urls: string[], input: HTMLInputElement) {
    if (urls.length > 0) {
      this.galleryService.addPhotos(urls).subscribe(() => this.loadPhotos());
    }
    input.value = '';
  }
}
