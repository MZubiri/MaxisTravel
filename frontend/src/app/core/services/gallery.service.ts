import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface GalleryPhoto {
  id: string;
  url: string;
  inCarousel: boolean;
  uploadedAt: string;
}

@Injectable({ providedIn: 'root' })
export class GalleryService {
  private defaultPhotos: GalleryPhoto[] = [
    { id: '1', url: 'assets/images/tours/barroco-andino/barroco-005.jpeg', inCarousel: true, uploadedAt: '2024-01-01' },
    { id: '2', url: 'assets/images/tours/city-tour/city-tour-005.jpeg', inCarousel: true, uploadedAt: '2024-01-01' },
    { id: '3', url: 'assets/images/tours/barroco-andino/barroco-010.jpeg', inCarousel: true, uploadedAt: '2024-01-01' },
    { id: '4', url: 'assets/images/tours/city-tour/city-tour-010.jpeg', inCarousel: true, uploadedAt: '2024-01-01' },
    { id: '5', url: 'assets/images/tours/barroco-andino/barroco-015.jpeg', inCarousel: true, uploadedAt: '2024-01-01' },
    { id: '6', url: 'assets/images/tours/city-tour/city-tour-015.jpeg', inCarousel: true, uploadedAt: '2024-01-01' },
    { id: '7', url: 'assets/images/tours/barroco-andino/barroco-020.jpeg', inCarousel: true, uploadedAt: '2024-01-01' },
    { id: '8', url: 'assets/images/tours/city-tour/city-tour-020.jpeg', inCarousel: true, uploadedAt: '2024-01-01' },
    { id: '9', url: 'assets/images/tours/barroco-andino/barroco-030.jpeg', inCarousel: true, uploadedAt: '2024-01-01' },
    { id: '10', url: 'assets/images/tours/city-tour/city-tour-025.jpeg', inCarousel: true, uploadedAt: '2024-01-01' },
    { id: '11', url: 'assets/images/tours/barroco-andino/barroco-040.jpeg', inCarousel: true, uploadedAt: '2024-01-01' },
    { id: '12', url: 'assets/images/tours/city-tour/city-tour-030.jpeg', inCarousel: true, uploadedAt: '2024-01-01' }
  ];

  photosSignal = signal<GalleryPhoto[]>([]);

  constructor() {
    const saved = localStorage.getItem('maxis_gallery_photos');
    if (saved) {
      try {
        this.photosSignal.set(JSON.parse(saved));
      } catch {
        this.photosSignal.set(this.defaultPhotos);
      }
    } else {
      this.photosSignal.set(this.defaultPhotos);
      this.saveLocal();
    }
  }

  getCarouselPhotos(): Observable<string[]> {
    const activeUrls = this.photosSignal()
      .filter(p => p.inCarousel)
      .map(p => p.url);
    return of(activeUrls);
  }

  getAllPhotos(): Observable<GalleryPhoto[]> {
    return of(this.photosSignal());
  }

  addPhotos(dataUrls: string[]): Observable<boolean> {
    const current = this.photosSignal();
    const newPhotos: GalleryPhoto[] = dataUrls.map((url, i) => ({
      id: Date.now().toString() + i,
      url,
      inCarousel: true,
      uploadedAt: new Date().toISOString()
    }));
    const updated = [...newPhotos, ...current];
    this.photosSignal.set(updated);
    this.saveLocal();
    return of(true);
  }

  toggleCarousel(id: string): Observable<boolean> {
    const current = this.photosSignal();
    const index = current.findIndex(p => p.id === id);
    if (index !== -1) {
      const updated = [...current];
      updated[index].inCarousel = !updated[index].inCarousel;
      this.photosSignal.set(updated);
      this.saveLocal();
      return of(updated[index].inCarousel);
    }
    return of(false);
  }

  deletePhoto(id: string): Observable<boolean> {
    const current = this.photosSignal();
    const filtered = current.filter(p => p.id !== id);
    this.photosSignal.set(filtered);
    this.saveLocal();
    return of(true);
  }

  private saveLocal() {
    localStorage.setItem('maxis_gallery_photos', JSON.stringify(this.photosSignal()));
  }
}
