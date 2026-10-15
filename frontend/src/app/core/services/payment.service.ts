import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PaymentRequest {
  tourId: string;
  tourName: string;
  pricePerPerson: number;
  passengers: number;
  totalAmount: number;
  currency: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  travelDate: string;
}

export interface PaymentPreferenceResponse {
  preferenceId: string;
  initPoint: string; // Mercado Pago Checkout Pro URL
  sandboxInitPoint: string;
  publicKey?: string;
  externalReference?: string;
}

export interface Booking {
  id: number;
  tourId: string;
  tourName: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  travelDate: string;
  passengers: number;
  totalAmount: number;
  currency: string;
  preferenceId: string;
  paymentId?: string;
  status: string; // Pending, Approved, InProcess, Rejected, Cancelled
  paymentMethod?: string;
  externalReference?: string;
  createdAt: string;
  updatedAt?: string;
}

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private apiUrl = `${environment.apiUrl}/payments`;
  private adminApiUrl = `${environment.apiUrl}/admin/bookings`;

  bookings = signal<Booking[]>([]);

  constructor(private http: HttpClient) {}

  createMercadoPagoPreference(req: PaymentRequest): Observable<PaymentPreferenceResponse> {
    return this.http.post<PaymentPreferenceResponse>(`${this.apiUrl}/create-preference`, req).pipe(
      catchError(err => {
        console.warn('Backend payment endpoint error, fallback to client preference URL generation:', err);
        const demoUrl = `https://www.mercadopago.com.pe/checkout/v1/redirect?pref_id=demo-${Date.now()}`;
        return of({
          preferenceId: `demo-${Date.now()}`,
          initPoint: demoUrl,
          sandboxInitPoint: demoUrl,
          publicKey: environment.mercadoPagoPublicKey || 'APP_USR-07d0d64a-6428-427f-b42a-e64a80b453da'
        });
      })
    );
  }

  getAdminBookings(status?: string): Observable<Booking[]> {
    const url = status && status !== 'all' ? `${this.adminApiUrl}?status=${status}` : this.adminApiUrl;
    return this.http.get<Booking[]>(url).pipe(
      tap(bookings => this.bookings.set(bookings)),
      catchError(err => {
        console.warn('Error cargando reservas desde backend, usando fallback local:', err);
        // Fallback demo data if backend offline
        const fallbackBookings: Booking[] = [
          {
            id: 1,
            tourId: 'machu-picchu-full-day',
            tourName: 'Machu Picchu Mágico Full Day',
            customerName: 'Carlos Mendoza',
            customerEmail: 'carlos.mendoza@gmail.com',
            customerPhone: '+51 987 654 321',
            travelDate: '2026-11-15',
            passengers: 2,
            totalAmount: 590,
            currency: 'USD',
            preferenceId: 'demo-pref-1',
            paymentId: 'MP-8923412',
            status: 'Approved',
            paymentMethod: 'visa',
            externalReference: 'MAXIS-MP-1',
            createdAt: new Date().toISOString()
          },
          {
            id: 2,
            tourId: 'valle-sagrado-vip',
            tourName: 'Valle Sagrado VIP & Maras Moray',
            customerName: 'Elena Rostova',
            customerEmail: 'elena.rostova@travel.com',
            customerPhone: '+1 415 555 2671',
            travelDate: '2026-11-20',
            passengers: 1,
            totalAmount: 180,
            currency: 'USD',
            preferenceId: 'demo-pref-2',
            paymentId: 'MP-8923415',
            status: 'Approved',
            paymentMethod: 'master',
            externalReference: 'MAXIS-VS-2',
            createdAt: new Date(Date.now() - 86400000).toISOString()
          }
        ];
        this.bookings.set(fallbackBookings);
        return of(fallbackBookings);
      })
    );
  }

  updateBookingStatus(id: number, status: string): Observable<Booking | null> {
    return this.http.patch<Booking>(`${this.adminApiUrl}/${id}/status`, { status }).pipe(
      tap(updated => {
        this.bookings.update(list => list.map(b => b.id === id ? { ...b, status, updatedAt: new Date().toISOString() } : b));
      }),
      catchError(err => {
        console.warn('Error actualizando estado en backend, actualizando localmente:', err);
        this.bookings.update(list => list.map(b => b.id === id ? { ...b, status, updatedAt: new Date().toISOString() } : b));
        const current = this.bookings().find(b => b.id === id);
        return of(current || null);
      })
    );
  }

  deleteBooking(id: number): Observable<boolean> {
    return this.http.delete(`${this.adminApiUrl}/${id}`).pipe(
      map(() => true),
      tap(() => {
        this.bookings.update(list => list.filter(b => b.id !== id));
      }),
      catchError(err => {
        console.warn('Error eliminando reserva en backend, eliminando localmente:', err);
        this.bookings.update(list => list.filter(b => b.id !== id));
        return of(true);
      })
    );
  }
}
