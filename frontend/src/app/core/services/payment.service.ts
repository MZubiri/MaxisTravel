import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
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
}

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private apiUrl = `${environment.apiUrl}/payments`;

  constructor(private http: HttpClient) {}

  createMercadoPagoPreference(req: PaymentRequest): Observable<PaymentPreferenceResponse> {
    return this.http.post<PaymentPreferenceResponse>(`${this.apiUrl}/create-preference`, req).pipe(
      catchError(err => {
        console.warn('Backend payment endpoint error, fallback to client preference URL generation:', err);
        // Fallback for standalone demo if backend endpoint is unavailable
        const demoUrl = `https://www.mercadopago.com.pe/checkout/v1/redirect?pref_id=demo-${Date.now()}`;
        return of({
          preferenceId: `demo-${Date.now()}`,
          initPoint: demoUrl,
          sandboxInitPoint: demoUrl,
          publicKey: 'APP_USR-34d6e223-2266-4ade-ab48-feb3064fa79b'
        });
      })
    );
  }
}
