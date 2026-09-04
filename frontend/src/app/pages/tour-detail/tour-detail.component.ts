import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TourService } from '../../core/services/tour.service';
import { PaymentService, PaymentRequest } from '../../core/services/payment.service';
import { Tour } from '../../core/models/tour.model';

@Component({
  selector: 'app-tour-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tour-detail.component.html',
  styleUrls: ['./tour-detail.component.css']
})
export class TourDetailComponent implements OnInit {
  tour!: Tour;
  whatsappLink = '';

  // Booking & Payment state
  passengers = 1;
  travelDate = '';
  buyerName = 'Comprador Prueba';
  buyerEmail = 'testuser@maxistravel.com';
  buyerPhone = '920698122';
  
  showPaymentModal = false;
  isProcessingPayment = false;
  showTestCredentials = false;
  isSandboxMode = false; // Toggle between Live Production and Test Sandbox

  constructor(
    private route: ActivatedRoute, 
    private tourService: TourService, 
    private paymentService: PaymentService,
    private router: Router
  ) {}

  ngOnInit() {
    // Default date: tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    this.travelDate = tomorrow.toISOString().split('T')[0];

    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        this.tourService.getTourBySlug(slug).subscribe(t => {
          if (t) {
            this.tour = t;
            this.updateWhatsappLink();
          } else {
            this.router.navigate(['/tours']);
          }
        });
      }
    });
  }

  updateWhatsappLink() {
    if (this.tour) {
      this.whatsappLink = `https://wa.me/51920698122?text=Hola MaxisTravel, estoy interesado en reservar el tour ${this.tour.name} para ${this.passengers} persona(s) el ${this.travelDate}.`;
    }
  }

  get totalAmount(): number {
    return (this.tour?.price || 0) * this.passengers;
  }

  openPaymentModal() {
    this.showPaymentModal = true;
  }

  closePaymentModal() {
    if (!this.isProcessingPayment) {
      this.showPaymentModal = false;
    }
  }

  toggleTestCredentials() {
    this.showTestCredentials = !this.showTestCredentials;
    if (this.showTestCredentials) {
      this.isSandboxMode = true; // Automatically enable Sandbox mode when test credentials panel is opened
    }
  }

  payWithMercadoPago() {
    if (this.isProcessingPayment) return;

    this.isProcessingPayment = true;

    const req: PaymentRequest = {
      tourId: (this.tour.id || this.tour.slug || '1').toString(),
      tourName: this.tour.name,
      pricePerPerson: this.tour.price,
      passengers: this.passengers,
      totalAmount: this.totalAmount,
      currency: 'USD',
      buyerName: this.buyerName,
      buyerEmail: this.buyerEmail,
      buyerPhone: this.buyerPhone,
      travelDate: this.travelDate
    };

    this.paymentService.createMercadoPagoPreference(req).subscribe({
      next: (res) => {
        this.isProcessingPayment = false;
        // If Sandbox Mode is selected or test credentials opened, use sandboxInitPoint
        const checkoutUrl = (this.isSandboxMode && res.sandboxInitPoint) 
          ? res.sandboxInitPoint 
          : (res.initPoint || res.sandboxInitPoint);

        if (checkoutUrl) {
          window.location.href = checkoutUrl;
        } else {
          alert('No se pudo generar la pasarela de pago de Mercado Pago. Intente nuevamente.');
        }
      },
      error: (err) => {
        this.isProcessingPayment = false;
        console.error('Error initiating Mercado Pago checkout:', err);
        alert('Ocurrió un error al conectar con Mercado Pago. Intente nuevamente.');
      }
    });
  }
}
