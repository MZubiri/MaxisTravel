import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Tour } from '../models/tour.model';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TourService {
  constructor(private api: ApiService) {}
  
  // Mock data for immediate frontend rendering
  getMockTours(): Tour[] {
    return [
      { id: '1', slug: 'city-tour-cusco', name: 'City Tour Cusco', price: 20, description: 'Descubre la magia del Cusco y sus ruinas aledañas.', duration: '4h', difficulty: 'Fácil', type: 'Cultural', isPublished: true, imageUrl: 'assets/images/tours/city-tour/city-tour-001.jpeg' },
      { id: '2', slug: 'montana-7-colores', name: 'Montaña 7 Colores', price: 40, description: 'Aventura increible en la montaña Vinicunca.', duration: 'Full Day', difficulty: 'Moderada-Exigente', type: 'Aventura', isPublished: true, imageUrl: 'assets/images/tours/rainbow-001.jpg' },
      { id: '3', slug: 'laguna-humantay', name: 'Laguna Humantay', price: 40, description: 'Trekking hacia una de las lagunas más hermosas.', duration: 'Full Day', difficulty: 'Moderada-Exigente', type: 'Naturaleza', isPublished: true, imageUrl: 'assets/images/tours/humantay-001.jpg' },
      { id: '4', slug: 'valle-sagrado', name: 'Valle Sagrado', price: 50, description: 'Conoce los pueblos del Valle Sagrado de los Incas.', duration: '~12h', difficulty: 'Moderada', type: 'Cultural', isPublished: true, imageUrl: 'assets/images/tours/valle-001.jpg' },
      { id: '5', slug: 'tour-barroco-andino', name: 'Tour Barroco Andino', price: 55, description: 'Ruta de las iglesias coloniales del sur del Cusco.', duration: '1 día', difficulty: 'Fácil', type: 'Cultural', isPublished: true, imageUrl: 'assets/images/tours/barroco-andino/barroco-001.jpeg' }
    ];
  }

  getTours(): Observable<Tour[]> { return of(this.getMockTours()); }
  getTourBySlug(slug: string): Observable<Tour | undefined> { return of(this.getMockTours().find(t => t.slug === slug)); }
}
