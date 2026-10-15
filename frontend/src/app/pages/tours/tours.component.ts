import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TourCardComponent } from '../../shared/components/tour-card/tour-card.component';
import { TourService } from '../../core/services/tour.service';
import { Tour } from '../../core/models/tour.model';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-tours',
  standalone: true,
  imports: [CommonModule, RouterModule, TourCardComponent, TranslatePipe],
  templateUrl: './tours.component.html',
  styleUrls: ['./tours.component.css']
})
export class ToursComponent implements OnInit {
  activeFilter = 'Todos';
  filters = ['Todos', 'Cultural', 'Aventura', 'Naturaleza'];
  paymentStatus: 'approved' | 'pending' | 'failure' | null = null;

  get allTours(): Tour[] {
    return this.tourService.toursSignal().filter(t => t.isPublished);
  }

  get filteredTours(): Tour[] {
    if (this.activeFilter === 'Todos') return this.allTours;
    return this.allTours.filter(t => t.type === this.activeFilter);
  }

  constructor(
    private tourService: TourService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.tourService.getTours().subscribe();

    this.route.queryParamMap.subscribe(params => {
      const p = params.get('payment');
      if (p === 'approved' || p === 'pending' || p === 'failure') {
        this.paymentStatus = p;
      }
    });
  }

  setFilter(filter: string) {
    this.activeFilter = filter;
  }

  getFilterLabel(filter: string): string {
    switch (filter) {
      case 'Todos': return 'tours.filter_all';
      case 'Cultural': return 'tours.filter_cultural';
      case 'Aventura': return 'tours.filter_adventure';
      case 'Naturaleza': return 'tours.filter_nature';
      default: return filter;
    }
  }

  dismissPaymentStatus() {
    this.paymentStatus = null;
  }
}
