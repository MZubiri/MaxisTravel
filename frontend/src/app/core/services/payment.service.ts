import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
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
}

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private apiUrl = `${environment.apiUrl}/payments`;

  constructor(private http: HttpClient) {}

  createMercadoPagoPreference(req: PaymentRequest): Observable<PaymentPreferenceResponse> {
    // Try backend API first if available, otherwise return sandbox preference URL
    return this.http.post<PaymentPreferenceResponse>(`${this.apiUrl}/create-preference`, req);
  }

  processDemoMercadoPagoCheckout(req: PaymentRequest) {
    // Mercado Pago Checkout Pro simulation URL or live link
    const itemTitle = encodeURIComponent(`MaxisTravel Tour: ${req.tourName} (${req.passengers} personas - ${req.travelDate})`);
    const amount = req.totalAmount;
    
    // Mercado Pago Checkout link
    const demoUrl = `https://www.mercadopago.com.pe/checkout/v1/redirect?pref_id=demo-${Date.now()}`;
    return demoUrl;
  }
}
