import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TourService } from '../../core/services/tour.service';
import { PaymentService } from '../../core/services/payment.service';
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
  showPaymentModal = false;

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
            this.whatsappLink = `https://wa.me/51920698122?text=Hola MaxisTravel, estoy interesado en reservar el tour ${t.name} para ${this.passengers} persona(s).`;
          } else {
            this.router.navigate(['/tours']);
          }
        });
      }
    });
  }

  get totalAmount(): number {
    return (this.tour?.price || 0) * this.passengers;
  }

  openPaymentModal() {
    this.showPaymentModal = true;
  }

  closePaymentModal() {
    this.showPaymentModal = false;
  }

  payWithMercadoPago() {
    const req = {
      tourId: this.tour.id || this.tour.slug,
      tourName: this.tour.name,
      pricePerPerson: this.tour.price,
      passengers: this.passengers,
      totalAmount: this.totalAmount,
      currency: 'USD',
      buyerName: 'Pasajero',
      buyerEmail: 'cliente@maxistravel.com',
      buyerPhone: '+51 920 698 122',
      travelDate: this.travelDate
    };

    const checkoutUrl = this.paymentService.processDemoMercadoPagoCheckout(req);
    window.open(checkoutUrl, '_blank');
  }
}
