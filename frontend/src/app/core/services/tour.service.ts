import { Injectable, signal } from '@angular/core';
import { ApiService } from './api.service';
import { I18nService } from './i18n.service';
import { Tour } from '../models/tour.model';
import { Observable, of, tap, catchError, map } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TourService {
  toursSignal = signal<Tour[]>([]);

  constructor(private api: ApiService, private i18n: I18nService) {
    const saved = localStorage.getItem('maxis_tours');
    if (saved) {
      try {
        this.toursSignal.set(JSON.parse(saved));
      } catch {
        this.toursSignal.set([]);
      }
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
        if (dtoList && Array.isArray(dtoList) && dtoList.length > 0) {
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
      map(dtoList => {
        const mapped = (dtoList || []).map(dto => this.mapDtoToTour(dto, lang));
        this.toursSignal.set(mapped);
        this.saveLocal();
        return mapped;
      }),
      catchError(() => of(this.toursSignal().filter(t => t.isPublished)))
    );
  }

  getAllToursAdmin(): Observable<Tour[]> {
    return this.api.get<any[]>('/admin/tours').pipe(
      map(dtoList => {
        const mapped = (dtoList || []).map(dto => this.mapDtoToTour(dto, 'es'));
        this.toursSignal.set(mapped);
        this.saveLocal();
        return mapped;
      }),
      catchError(() => of(this.toursSignal()))
    );
  }

  getTourBySlug(slug: string): Observable<Tour | undefined> {
    const lang = this.i18n.currentLang();
    return this.api.get<any>(`/tours/${slug}?language=${lang}`).pipe(
      map(dto => {
        if (!dto) return undefined;
        const mapped = this.mapDtoToTour(dto, lang);
        const current = this.toursSignal();
        const idx = current.findIndex(t => t.slug === slug);
        if (idx !== -1) current[idx] = mapped;
        else current.push(mapped);
        this.toursSignal.set([...current]);
        this.saveLocal();
        return mapped;
      }),
      catchError(() => of(this.toursSignal().find(t => t.slug === slug)))
    );
  }

  addTour(tour: Tour): Observable<Tour> {
    const newTour: Tour = {
      ...tour,
      slug: tour.slug || tour.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      isPublished: tour.isPublished !== undefined ? tour.isPublished : true,
      imageUrl: tour.imageUrl || 'assets/images/tours/city-tour/city-tour-001.jpeg'
    };

    const payload = this.mapTourToCreateDto(newTour);
    return this.api.post<any>('/admin/tours', payload).pipe(
      map(created => {
        const mapped = created ? this.mapDtoToTour(created) : newTour;
        const updated = [mapped, ...this.toursSignal().filter(t => t.slug !== mapped.slug)];
        this.toursSignal.set(updated);
        this.saveLocal();
        return mapped;
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
        map(res => {
          const mapped = res ? this.mapDtoToTour(res) : updatedTour;
          const list = [...this.toursSignal()];
          list[index] = mapped;
          this.toursSignal.set(list);
          this.saveLocal();
          return mapped;
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
    const transEn = dto.translations?.find((tr: any) => tr.languageCode === 'en');
    const primaryImg = dto.images?.find((img: any) => img.isPrimary)?.imageUrl || dto.images?.[0]?.imageUrl;
    
    return {
      id: dto.id?.toString(),
      slug: dto.slug,
      name: trans.title || dto.slug,
      price: dto.price || 0,
      description: trans.shortDescription || '',
      fullDescription: trans.fullDescription || '',
      nameEn: transEn?.title,
      descriptionEn: transEn?.shortDescription,
      fullDescriptionEn: transEn?.fullDescription,
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
    const whatToBringText = (tour.whatToBring && tour.whatToBring.length > 0)
      ? tour.whatToBring.join('\n')
      : 'Ropa cómoda, calzado para caminar, agua y bloqueador solar.';

    const translations: any[] = [
      {
        languageCode: 'es',
        title: tour.name,
        shortDescription: tour.description,
        fullDescription: tour.fullDescription || tour.description,
        whatToBring: whatToBringText
      }
    ];

    if (tour.nameEn || tour.descriptionEn || tour.fullDescriptionEn) {
      translations.push({
        languageCode: 'en',
        title: tour.nameEn || tour.name,
        shortDescription: tour.descriptionEn || tour.description,
        fullDescription: tour.fullDescriptionEn || tour.fullDescription || tour.description,
        whatToBring: whatToBringText
      });
    }

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
      translations: translations,
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
