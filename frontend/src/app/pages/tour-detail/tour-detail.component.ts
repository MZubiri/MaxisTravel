import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { TourService } from '../../core/services/tour.service';
import { Tour } from '../../core/models/tour.model';

@Component({
  selector: 'app-tour-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tour-detail.component.html',
  styleUrls: ['./tour-detail.component.css']
})
export class TourDetailComponent implements OnInit {
  tour!: Tour;
  whatsappLink = '';

  constructor(private route: ActivatedRoute, private tourService: TourService, private router: Router) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const slug = params.get('slug');
      if (slug) {
        this.tourService.getTourBySlug(slug).subscribe(t => {
          if (t) {
            this.tour = t;
            this.whatsappLink = `https://wa.me/51920698122?text=Hola MaxisTravel, estoy interesado en el tour ${t.name}.`;
          } else {
            this.router.navigate(['/tours']);
          }
        });
      }
    });
  }
}
