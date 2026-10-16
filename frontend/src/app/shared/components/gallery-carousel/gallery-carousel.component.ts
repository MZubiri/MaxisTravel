import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gallery-carousel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="carousel-container" (mouseenter)="pauseAutoPlay()" (mouseleave)="startAutoPlay()">
      <!-- Main Display -->
      <div class="carousel-viewport">
        <button class="nav-btn prev-btn" (click)="prevSlide()" aria-label="Anterior">❮</button>
        
        <div class="slide-wrapper" (click)="openLightbox(currentIndex)">
          <img 
            [src]="photos[currentIndex]" 
            alt="Galería MaxisTravel" 
            class="slide-img fade-in">
          <div class="slide-overlay">
            <span class="slide-counter">📸 {{ currentIndex + 1 }} / {{ photos.length }}</span>
            <span class="expand-icon">🔍 Clic para ampliar</span>
          </div>
        </div>

        <button class="nav-btn next-btn" (click)="nextSlide()" aria-label="Siguiente">❯</button>
      </div>

      <!-- Pagination Dots -->
      <div class="dots-container">
        <button 
          *ngFor="let photo of photos; let i = index" 
          class="dot-btn" 
          [class.active]="i === currentIndex"
          (click)="goToSlide(i)"
          [attr.aria-label]="'Ir a foto ' + (i + 1)">
        </button>
      </div>

      <!-- Thumbnail Strip -->
      <div class="thumbnails-strip">
        <div 
          *ngFor="let photo of photos; let i = index" 
          class="thumb-item" 
          [class.active]="i === currentIndex"
          (click)="goToSlide(i)">
          <img [src]="photo" alt="Miniatura" loading="lazy">
        </div>
      </div>
    </div>

    <!-- Lightbox Modal -->
    <div class="lightbox-modal" *ngIf="lightboxOpen" (click)="closeLightbox()">
      <button class="lightbox-close" (click)="closeLightbox()">✕</button>
      <button class="lightbox-btn prev" (click)="$event.stopPropagation(); prevSlide()">❮</button>
      <img [src]="photos[currentIndex]" class="lightbox-img" (click)="$event.stopPropagation()">
      <button class="lightbox-btn next" (click)="$event.stopPropagation(); nextSlide()">❯</button>
      <div class="lightbox-caption">Foto {{ currentIndex + 1 }} de {{ photos.length }}</div>
    </div>
  `,
  styles: [`
    .carousel-container {
      position: relative;
      width: 100%;
      max-width: 1100px;
      margin: 0 auto;
      user-select: none;
    }

    .carousel-viewport {
      position: relative;
      width: 100%;
      height: 480px;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 0 16px 40px rgba(61, 43, 31, 0.15);
      background: #1A1A2E;
    }

    .slide-wrapper {
      width: 100%;
      height: 100%;
      position: relative;
      cursor: pointer;
    }

    .slide-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: opacity 0.5s ease;
    }

    .slide-overlay {
      position: absolute;
      bottom: 0; left: 0; right: 0;
      padding: 20px 30px;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0) 100%);
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: white;
    }

    .slide-counter {
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(8px);
      padding: 6px 16px;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 600;
    }

    .expand-icon {
      font-size: 0.85rem;
      color: rgba(255, 255, 255, 0.8);
    }

    .nav-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      z-index: 10;
      background: rgba(255, 255, 255, 0.25);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.4);
      color: white;
      width: 52px;
      height: 52px;
      border-radius: 50%;
      font-size: 1.4rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }

    .nav-btn:hover {
      background: var(--color-primary, #C97F6C);
      border-color: var(--color-primary, #C97F6C);
      transform: translateY(-50%) scale(1.1);
    }

    .prev-btn { left: 20px; }
    .next-btn { right: 20px; }

    .dots-container {
      display: flex;
      justify-content: center;
      gap: 10px;
      margin-top: 20px;
    }

    .dot-btn {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: none;
      background: #D1D5DB;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .dot-btn.active {
      width: 32px;
      border-radius: 12px;
      background: var(--color-primary, #C97F6C);
    }

    .thumbnails-strip {
      display: flex;
      gap: 12px;
      overflow-x: auto;
      padding: 16px 4px;
      scrollbar-width: thin;
      margin-top: 10px;
    }

    .thumb-item {
      flex: 0 0 90px;
      height: 60px;
      border-radius: 12px;
      overflow: hidden;
      cursor: pointer;
      opacity: 0.6;
      border: 2px solid transparent;
      transition: all 0.3s ease;
    }

    .thumb-item.active, .thumb-item:hover {
      opacity: 1;
      border-color: var(--color-primary, #C97F6C);
      transform: scale(1.05);
    }

    .thumb-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    /* Lightbox Styles */
    .lightbox-modal {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0, 0, 0, 0.92);
      z-index: 3000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      backdrop-filter: blur(10px);
    }

    .lightbox-img {
      max-width: 90vw;
      max-height: 85vh;
      object-fit: contain;
      border-radius: 12px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
    }

    .lightbox-close {
      position: absolute;
      top: 30px;
      right: 30px;
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: white;
      font-size: 1.8rem;
      width: 44px;
      height: 44px;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .lightbox-btn {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(255, 255, 255, 0.2);
      border: none;
      color: white;
      font-size: 1.6rem;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      cursor: pointer;
    }

    .lightbox-btn.prev { left: 30px; }
    .lightbox-btn.next { right: 30px; }

    .lightbox-caption {
      position: absolute;
      bottom: 30px;
      color: white;
      font-size: 1.1rem;
      background: rgba(0, 0, 0, 0.6);
      padding: 8px 20px;
      border-radius: 20px;
    }

    @media (max-width: 768px) {
      .carousel-viewport { height: 320px; }
      .nav-btn { width: 40px; height: 40px; font-size: 1rem; }
      .prev-btn { left: 10px; }
      .next-btn { right: 10px; }
    }

    @media (max-width: 500px) {
      .carousel-viewport { height: 250px; border-radius: 16px; }
      .slide-overlay { padding: 12px 14px; }
      .slide-counter { font-size: 0.75rem; padding: 4px 10px; }
      .expand-icon { font-size: 0.72rem; }
      .nav-btn { width: 36px; height: 36px; font-size: 0.85rem; }
      .prev-btn { left: 6px; }
      .next-btn { right: 6px; }
      .lightbox-btn.prev { left: 10px; width: 40px; height: 40px; }
      .lightbox-btn.next { right: 10px; width: 40px; height: 40px; }
      .lightbox-close { top: 15px; right: 15px; width: 38px; height: 38px; font-size: 1.4rem; }
      .thumb-item { flex: 0 0 70px; height: 48px; border-radius: 8px; }
    }
  `]
})
export class GalleryCarouselComponent implements OnInit, OnDestroy {
  @Input() photos: string[] = [];
  @Input() autoPlay: boolean = true;
  @Input() interval: number = 3500;

  currentIndex = 0;
  lightboxOpen = false;
  private timer: any = null;

  ngOnInit() {
    if (this.autoPlay) {
      this.startAutoPlay();
    }
  }

  ngOnDestroy() {
    this.stopAutoPlay();
  }

  nextSlide() {
    if (this.photos.length === 0) return;
    this.currentIndex = (this.currentIndex + 1) % this.photos.length;
  }

  prevSlide() {
    if (this.photos.length === 0) return;
    this.currentIndex = (this.currentIndex - 1 + this.photos.length) % this.photos.length;
  }

  goToSlide(index: number) {
    this.currentIndex = index;
  }

  openLightbox(index: number) {
    this.currentIndex = index;
    this.lightboxOpen = true;
  }

  closeLightbox() {
    this.lightboxOpen = false;
  }

  startAutoPlay() {
    this.stopAutoPlay();
    this.timer = setInterval(() => {
      this.nextSlide();
    }, this.interval);
  }

  pauseAutoPlay() {
    this.stopAutoPlay();
  }

  stopAutoPlay() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}
