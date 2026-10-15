import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TourCardComponent } from '../../shared/components/tour-card/tour-card.component';
import { TourService } from '../../core/services/tour.service';
import { Tour } from '../../core/models/tour.model';

@Component({
  selector: 'app-tours',
  standalone: true,
  imports: [CommonModule, RouterModule, TourCardComponent],
  templateUrl: './tours.component.html',
  styleUrls: ['./tours.component.css']
})
export class ToursComponent implements OnInit {
  tours: Tour[] = [];
  filteredTours: Tour[] = [];
  activeFilter = 'Todos';
  filters = ['Todos', 'Cultural', 'Aventura', 'Naturaleza'];
  paymentStatus: 'approved' | 'pending' | 'failure' | null = null;

  constructor(
    private tourService: TourService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.tourService.getTours().subscribe(t => {
      this.tours = t;
      this.filteredTours = t;
    });

    this.route.queryParamMap.subscribe(params => {
      const p = params.get('payment');
      if (p === 'approved' || p === 'pending' || p === 'failure') {
        this.paymentStatus = p;
      }
    });
  }

  setFilter(filter: string) {
    this.activeFilter = filter;
    if (filter === 'Todos') this.filteredTours = this.tours;
    else this.filteredTours = this.tours.filter(t => t.type === filter);
  }

  dismissPaymentStatus() {
    this.paymentStatus = null;
  }
}
