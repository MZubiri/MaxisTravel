import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { TourCardComponent } from '../../shared/components/tour-card/tour-card.component';
import { GalleryCarouselComponent } from '../../shared/components/gallery-carousel/gallery-carousel.component';
import { TourService } from '../../core/services/tour.service';
import { Tour } from '../../core/models/tour.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, TranslatePipe, TourCardComponent, GalleryCarouselComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  tours: Tour[] = [];
  galleryPhotos = [
    'assets/images/tours/barroco-andino/barroco-005.jpeg', 'assets/images/tours/city-tour/city-tour-005.jpeg',
    'assets/images/tours/barroco-andino/barroco-010.jpeg', 'assets/images/tours/city-tour/city-tour-010.jpeg',
    'assets/images/tours/barroco-andino/barroco-015.jpeg', 'assets/images/tours/city-tour/city-tour-015.jpeg',
    'assets/images/tours/barroco-andino/barroco-020.jpeg', 'assets/images/tours/city-tour/city-tour-020.jpeg',
    'assets/images/tours/barroco-andino/barroco-030.jpeg', 'assets/images/tours/city-tour/city-tour-025.jpeg',
    'assets/images/tours/barroco-andino/barroco-040.jpeg', 'assets/images/tours/city-tour/city-tour-030.jpeg'
  ];

  constructor(private tourService: TourService) {}

  ngOnInit() {
    this.tourService.getTours().subscribe(t => this.tours = t);
  }
}
