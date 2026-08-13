import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Tour } from '../models/tour.model';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TourService {
  constructor(private api: ApiService) {}
  
  getMockTours(): Tour[] {
    return [
      { 
        id: '1', slug: 'city-tour-cusco', name: 'City Tour Cusco', price: 20, 
        description: 'Descubre la magia del Cusco y sus ruinas aledañas.',
        fullDescription: 'Un recorrido esencial para entender la historia del ombligo del mundo. Visitaremos los centros arqueológicos más importantes que rodean la ciudad del Cusco.',
        duration: '4h', difficulty: 'Fácil', type: 'Cultural', isPublished: true, imageUrl: 'assets/images/tours/city-tour/city-tour-001.jpeg',
        altitude: '3,700 msnm', schedule: '09:00 - 13:00 / 13:30 - 17:30', modality: 'Grupo Compartido',
        itinerary: [
          { time: '09:00', title: 'Inicio', icon: '📍' },
          { time: '09:30', title: 'Sacsayhuamán', icon: '🏛️' },
          { time: '10:30', title: 'Qenqo', icon: '🏛️' },
          { time: '11:15', title: 'Puka Pukara', icon: '🏛️' },
          { time: '11:45', title: 'Tambomachay', icon: '🏛️' },
          { time: '12:30', title: 'Qoricancha', icon: '🏛️' },
          { time: '13:00', title: 'Final', icon: '🏁' }
        ],
        includes: ['Recojo hotel', 'Transporte turístico', 'Guía bilingüe', 'Asistencia', 'Retorno'],
        notIncludes: ['Boleto Turístico', 'Ingreso Qoricancha', 'Alimentación', 'Gastos personales'],
        whatToBring: ['Documento identidad', 'Calzado cómodo', 'Bloqueador solar', 'Gafas de sol', 'Gorro', 'Agua', 'Cámara']
      },
      { 
        id: '2', slug: 'montana-7-colores', name: 'Montaña 7 Colores', price: 40, 
        description: 'Aventura increible en la montaña Vinicunca.',
        fullDescription: 'La Montaña de 7 Colores o Vinicunca es uno de los destinos más espectaculares del Cusco. Un trekking de altura que premia con paisajes surrealistas.',
        duration: 'Full Day', difficulty: 'Moderada-Exigente', type: 'Aventura', isPublished: true, imageUrl: 'assets/images/tours/rainbow-001.jpg',
        altitude: '5,200 msnm', schedule: '04:00 - 17:00', modality: 'Grupo Compartido',
        itinerary: [
          { time: '04:00', title: 'Recojo', icon: '🚐' },
          { time: '07:00', title: 'Desayuno Cusipata', icon: '☕' },
          { time: '09:00', title: 'Caminata', icon: '🥾' },
          { time: '11:00', title: 'Montaña 7 Colores', icon: '🏔️' },
          { time: '12:00', title: 'Descenso', icon: '⬇️' },
          { time: '13:00', title: 'Almuerzo', icon: '🍽️' },
          { time: '15:00', title: 'Retorno', icon: '🚐' },
          { time: '17:00', title: 'Llegada', icon: '🏁' }
        ],
        includes: ['Recojo hotel', 'Transporte', 'Desayuno', 'Almuerzo buffet', 'Ingreso montaña', 'Guía', 'Botiquín', 'Oxígeno'],
        notIncludes: ['Caballo', 'Cena', 'Gastos personales'],
        whatToBring: ['Documento', 'Botas trekking', 'Ropa abrigadora', 'Casaca impermeable', 'Gorro y guantes', 'Bloqueador', 'Gafas', 'Agua', 'Snacks', 'Poncho lluvia']
      },
      { 
        id: '3', slug: 'laguna-humantay', name: 'Laguna Humantay', price: 40, 
        description: 'Trekking hacia una de las lagunas más hermosas.',
        fullDescription: 'Una joya natural a los pies del nevado Salkantay. Sus aguas turquesas contrastan con la nieve y hacen de este trekking una experiencia inolvidable.',
        duration: 'Full Day', difficulty: 'Moderada-Exigente', type: 'Naturaleza', isPublished: true, imageUrl: 'assets/images/tours/humantay-001.jpg',
        altitude: '4,200 msnm', schedule: '04:00 - 15:00', modality: 'Grupo Compartido',
        itinerary: [
          { time: '04:00', title: 'Recojo', icon: '🚐' },
          { time: '07:00', title: 'Desayuno Mollepata', icon: '☕' },
          { time: '09:00', title: 'Caminata', icon: '🥾' },
          { time: '11:00', title: 'Laguna', icon: '🌊' },
          { time: '12:00', title: 'Descenso', icon: '⬇️' },
          { time: '13:00', title: 'Almuerzo', icon: '🍽️' },
          { time: '15:00', title: 'Retorno', icon: '🏁' }
        ],
        includes: ['Recojo hotel', 'Transporte', 'Desayuno', 'Almuerzo', 'Guía', 'Asistencia'],
        notIncludes: ['Caballo', 'Cena', 'Gastos personales'],
        whatToBring: ['Documento', 'Botas trekking', 'Ropa abrigadora', 'Casaca impermeable', 'Gorro y guantes', 'Bloqueador', 'Gafas', 'Agua', 'Snacks', 'Poncho lluvia']
      },
      { 
        id: '4', slug: 'valle-sagrado', name: 'Valle Sagrado', price: 50, 
        description: 'Conoce los pueblos del Valle Sagrado de los Incas.',
        fullDescription: 'Un recorrido completo por los sitios arqueológicos más imponentes y mercados tradicionales del Valle Sagrado.',
        duration: '~12h', difficulty: 'Moderada', type: 'Cultural', isPublished: true, imageUrl: 'assets/images/tours/valle-001.jpg',
        altitude: '2,900 msnm', schedule: '06:30 - 18:00', modality: 'Grupo Compartido',
        itinerary: [
          { time: '06:30', title: 'Recojo', icon: '🚐' },
          { time: '08:00', title: 'Chinchero', icon: '🏛️' },
          { time: '09:30', title: 'Moray', icon: '🏛️' },
          { time: '10:45', title: 'Salineras Maras', icon: '🧂' },
          { time: '12:30', title: 'Almuerzo', icon: '🍽️' },
          { time: '14:00', title: 'Ollantaytambo', icon: '🏛️' },
          { time: '16:30', title: 'Pisac', icon: '🏛️' },
          { time: '18:00', title: 'Retorno', icon: '🏁' }
        ],
        includes: ['Recojo hotel', 'Transporte', 'Guía bilingüe', 'Almuerzo buffet', 'Asistencia'],
        notIncludes: ['Boleto Turístico', 'Ingreso Salineras', 'Desayuno', 'Cena', 'Gastos personales'],
        whatToBring: ['Documento', 'Calzado cómodo', 'Bloqueador', 'Gorro', 'Gafas', 'Agua', 'Cámara', 'Poncho lluvia']
      },
      { 
        id: '5', slug: 'tour-barroco-andino', name: 'Tour Barroco Andino', price: 55, 
        description: 'Ruta de las iglesias coloniales del sur del Cusco.',
        fullDescription: 'Una ruta fascinante que explora la fusión del arte colonial y andino en majestuosas iglesias conocidas como la "Capilla Sixtina de América".',
        duration: '1 día', difficulty: 'Fácil', type: 'Cultural', isPublished: true, imageUrl: 'assets/images/tours/barroco-andino/barroco-001.jpeg',
        altitude: '3,200 msnm', schedule: '09:00 - 16:15', modality: 'Grupo Privado',
        itinerary: [
          { time: '09:00', title: 'Recojo', icon: '🚐' },
          { time: '09:30', title: 'Templo Compañía de Jesús', icon: '⛪' },
          { time: '10:45', title: 'Andahuaylillas', icon: '⛪' },
          { time: '11:45', title: 'Huaro', icon: '⛪' },
          { time: '12:30', title: 'Canincunca', icon: '⛪' },
          { time: '13:30', title: 'Almuerzo Saylla', icon: '🍽️' },
          { time: '15:30', title: 'Retorno', icon: '🚐' },
          { time: '16:15', title: 'Llegada', icon: '🏁' }
        ],
        includes: ['Recojo hotel', 'Transporte privado', 'Guía profesional', 'Asistencia', 'Almuerzo Saylla', 'Retorno hotel'],
        notIncludes: ['Ingresos templos', 'Seguro viaje', 'Gastos personales'],
        whatToBring: ['Documento', 'Calzado cómodo', 'Bloqueador', 'Gorro', 'Agua', 'Cámara', 'Poncho lluvia']
      }
    ];
  }

  getTours(): Observable<Tour[]> { return of(this.getMockTours()); }
  getTourBySlug(slug: string): Observable<Tour | undefined> { return of(this.getMockTours().find(t => t.slug === slug)); }
}
