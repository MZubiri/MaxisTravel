import { Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import { I18nService } from './i18n.service';
import { Tour } from '../models/tour.model';
import { Observable, of, tap, catchError, map } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TourService {
  private initialTours: Tour[] = [
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
      description: 'Aventura increíble en la montaña Vinicunca.',
      fullDescription: 'La Montaña de 7 Colores o Vinicunca es uno de los destinos más espectaculares del Cusco. Un trekking de altura que premia con paisajes surrealistas.',
      duration: 'Full Day', difficulty: 'Moderada-Exigente', type: 'Aventura', isPublished: true, imageUrl: 'assets/images/tours/montana-7-colores/rainbow-001.jpg',
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
      duration: 'Full Day', difficulty: 'Moderada-Exigente', type: 'Naturaleza', isPublished: true, imageUrl: 'assets/images/tours/laguna-humantay/humantay-001.jpg',
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
      duration: '~12h', difficulty: 'Moderada', type: 'Cultural', isPublished: true, imageUrl: 'assets/images/tours/valle-sagrado/valle-001.jpg',
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

  toursSignal = signal<Tour[]>([]);

  constructor(private api: ApiService, private i18n: I18nService) {
    const saved = localStorage.getItem('maxis_tours');
    if (saved) {
      try {
        this.toursSignal.set(JSON.parse(saved));
      } catch {
        this.toursSignal.set(this.initialTours);
      }
    } else {
      this.toursSignal.set(this.initialTours);
      this.saveLocal();
    }

    this.refreshFromApi();

    this.i18n.onLanguageChanged.subscribe(() => {
      this.refreshFromApi();
    });
  }

  private refreshFromApi() {
    const lang = this.i18n.currentLang();
    this.api.get<any[]>(`/tours?language=${lang}`).pipe(
      tap(dtoList => {
        if (dtoList && dtoList.length > 0) {
          const mapped = dtoList.map(dto => this.mapDtoToTour(dto, lang));
          this.toursSignal.set(mapped);
          this.saveLocal();
        }
      }),
      catchError(() => of(null))
    ).subscribe();
  }

  getTours(): Observable<Tour[]> {
    const lang = this.i18n.currentLang();
    return this.api.get<any[]>(`/tours?language=${lang}`).pipe(
      tap(dtoList => {
        if (dtoList && dtoList.length > 0) {
          const mapped = dtoList.map(dto => this.mapDtoToTour(dto, lang));
          this.toursSignal.set(mapped);
          this.saveLocal();
        }
      }),
      catchError(() => of(this.toursSignal().filter(t => t.isPublished)))
    );
  }

  getAllToursAdmin(): Observable<Tour[]> {
    return this.api.get<any[]>('/admin/tours').pipe(
      tap(dtoList => {
        if (dtoList && dtoList.length > 0) {
          const mapped = dtoList.map(dto => this.mapDtoToTour(dto, 'es'));
          this.toursSignal.set(mapped);
          this.saveLocal();
        }
      }),
      catchError(() => of(this.toursSignal()))
    );
  }

  getTourBySlug(slug: string): Observable<Tour | undefined> {
    const lang = this.i18n.currentLang();
    return this.api.get<any>(`/tours/${slug}?language=${lang}`).pipe(
      tap(dto => {
        if (dto) {
          const mapped = this.mapDtoToTour(dto, lang);
          const current = this.toursSignal();
          const idx = current.findIndex(t => t.slug === slug);
          if (idx !== -1) current[idx] = mapped;
          else current.push(mapped);
          this.toursSignal.set([...current]);
          this.saveLocal();
        }
      }),
      catchError(() => of(this.toursSignal().find(t => t.slug === slug)))
    );
  }

  addTour(tour: Tour): Observable<Tour> {
    const current = this.toursSignal();
    const newTour: Tour = {
      ...tour,
      id: (current.length + 1).toString(),
      slug: tour.slug || tour.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      isPublished: tour.isPublished !== undefined ? tour.isPublished : true,
      imageUrl: tour.imageUrl || 'assets/images/tours/city-tour/city-tour-001.jpeg'
    };

    const payload = this.mapTourToCreateDto(newTour);
    return this.api.post<any>('/admin/tours', payload).pipe(
      tap(created => {
        if (created && created.id) newTour.id = created.id.toString();
        const updated = [newTour, ...this.toursSignal()];
        this.toursSignal.set(updated);
        this.saveLocal();
      }),
      catchError(() => {
        const updated = [newTour, ...current];
        this.toursSignal.set(updated);
        this.saveLocal();
        return of(newTour);
      })
    );
  }

  updateTour(id: string, updatedFields: Partial<Tour>): Observable<Tour | null> {
    const current = this.toursSignal();
    const index = current.findIndex(t => t.id === id);
    if (index === -1) return of(null);

    const updatedTour = { ...current[index], ...updatedFields };
    const numId = parseInt(id, 10);

    if (!isNaN(numId)) {
      const payload = { ...this.mapTourToCreateDto(updatedTour), id: numId };
      return this.api.put<any>(`/admin/tours/${numId}`, payload).pipe(
        tap(() => {
          const list = [...this.toursSignal()];
          list[index] = updatedTour;
          this.toursSignal.set(list);
          this.saveLocal();
        }),
        catchError(() => {
          const list = [...current];
          list[index] = updatedTour;
          this.toursSignal.set(list);
          this.saveLocal();
          return of(updatedTour);
        })
      );
    }

    const updatedList = [...current];
    updatedList[index] = updatedTour;
    this.toursSignal.set(updatedList);
    this.saveLocal();
    return of(updatedTour);
  }

  deleteTour(id: string): Observable<boolean> {
    const numId = parseInt(id, 10);
    if (!isNaN(numId)) {
      return this.api.delete(`/admin/tours/${numId}`).pipe(
        tap(() => {
          const filtered = this.toursSignal().filter(t => t.id !== id);
          this.toursSignal.set(filtered);
          this.saveLocal();
        }),
        map(() => true),
        catchError(() => {
          const filtered = this.toursSignal().filter(t => t.id !== id);
          this.toursSignal.set(filtered);
          this.saveLocal();
          return of(true);
        })
      );
    }

    const current = this.toursSignal();
    const filtered = current.filter(t => t.id !== id);
    this.toursSignal.set(filtered);
    this.saveLocal();
    return of(true);
  }

  togglePublish(id: string): Observable<boolean> {
    const numId = parseInt(id, 10);
    if (!isNaN(numId)) {
      return this.api.patch(`/admin/tours/${numId}/toggle-publish`).pipe(
        tap(() => {
          const list = [...this.toursSignal()];
          const idx = list.findIndex(t => t.id === id);
          if (idx !== -1) {
            list[idx].isPublished = !list[idx].isPublished;
            this.toursSignal.set(list);
            this.saveLocal();
          }
        }),
        map(() => {
          const item = this.toursSignal().find(t => t.id === id);
          return item ? item.isPublished : false;
        }),
        catchError(() => {
          const list = [...this.toursSignal()];
          const idx = list.findIndex(t => t.id === id);
          if (idx !== -1) {
            list[idx].isPublished = !list[idx].isPublished;
            this.toursSignal.set(list);
            this.saveLocal();
            return of(list[idx].isPublished);
          }
          return of(false);
        })
      );
    }

    const current = this.toursSignal();
    const index = current.findIndex(t => t.id === id);
    if (index !== -1) {
      const updatedList = [...current];
      updatedList[index].isPublished = !updatedList[index].isPublished;
      this.toursSignal.set(updatedList);
      this.saveLocal();
      return of(updatedList[index].isPublished);
    }
    return of(false);
  }

  private mapDtoToTour(dto: any, lang = this.i18n.currentLang()): Tour {
    const trans = dto.translations?.find((tr: any) => tr.languageCode === lang) || dto.translations?.[0] || {};
    const primaryImg = dto.images?.find((img: any) => img.isPrimary)?.imageUrl || dto.images?.[0]?.imageUrl;
    
    return {
      id: dto.id?.toString(),
      slug: dto.slug,
      name: trans.title || dto.slug,
      price: dto.price || 0,
      description: trans.shortDescription || '',
      fullDescription: trans.fullDescription || '',
      duration: dto.duration || '',
      difficulty: dto.difficultyLevel || 'Fácil',
      type: dto.tourType || 'Cultural',
      isPublished: dto.isPublished ?? true,
      imageUrl: primaryImg || 'assets/images/tours/city-tour/city-tour-001.jpeg',
      altitude: dto.maxAltitude,
      schedule: dto.schedule,
      modality: dto.modality,
      itinerary: (dto.itineraries || []).map((i: any) => ({
        time: i.timeSlot,
        title: (lang === 'en' && i.titleEn) ? i.titleEn : (i.titleEs || i.title || ''),
        description: (lang === 'en' && i.descriptionEn) ? i.descriptionEn : (i.descriptionEs || i.description || ''),
        icon: i.icon || '📍'
      })),
      includes: (dto.inclusions || []).filter((i: any) => i.isIncluded).map((i: any) => (lang === 'en' && i.textEn) ? i.textEn : (i.textEs || i.text || '')),
      notIncludes: (dto.inclusions || []).filter((i: any) => !i.isIncluded).map((i: any) => (lang === 'en' && i.textEn) ? i.textEn : (i.textEs || i.text || '')),
      whatToBring: trans.whatToBring ? trans.whatToBring.split('\n').filter(Boolean) : []
    };
  }

  private mapTourToCreateDto(tour: Tour): any {
    return {
      slug: tour.slug,
      price: tour.price,
      currency: 'USD',
      duration: tour.duration,
      difficultyLevel: tour.difficulty,
      tourType: tour.type,
      maxAltitude: tour.altitude,
      schedule: tour.schedule || '09:00 - 17:00',
      modality: tour.modality || 'Grupo Compartido',
      isPublished: tour.isPublished,
      sortOrder: 1,
      translations: [
        {
          languageCode: 'es',
          title: tour.name,
          shortDescription: tour.description,
          fullDescription: tour.fullDescription || tour.description,
          whatToBring: (tour.whatToBring || []).join('\n')
        }
      ],
      itineraries: (tour.itinerary || []).map((it, idx) => ({
        timeSlot: it.time,
        titleEs: it.title,
        titleEn: it.title,
        descriptionEs: it.description || '',
        descriptionEn: it.description || '',
        icon: it.icon || '📍',
        sortOrder: idx + 1
      })),
      inclusions: [
        ...(tour.includes || []).map((inc, idx) => ({ textEs: inc, textEn: inc, isIncluded: true, sortOrder: idx + 1 })),
        ...(tour.notIncludes || []).map((nInc, idx) => ({ textEs: nInc, textEn: nInc, isIncluded: false, sortOrder: idx + 1 }))
      ],
      images: [
        { imageUrl: tour.imageUrl || 'assets/images/tours/city-tour/city-tour-001.jpeg', altText: tour.name, sortOrder: 1, isPrimary: true }
      ]
    };
  }

  private saveLocal() {
    localStorage.setItem('maxis_tours', JSON.stringify(this.toursSignal()));
  }
}
