import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { TourCardComponent } from '../../shared/components/tour-card/tour-card.component';
import { GalleryCarouselComponent } from '../../shared/components/gallery-carousel/gallery-carousel.component';
import { TourService } from '../../core/services/tour.service';
import { GalleryService } from '../../core/services/gallery.service';
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
  galleryPhotos: string[] = [];

  constructor(
    private tourService: TourService,
    private galleryService: GalleryService
  ) {}

  ngOnInit() {
    this.tourService.getTours().subscribe(t => this.tours = t);
    this.galleryService.getCarouselPhotos().subscribe(photos => this.galleryPhotos = photos);
  }
}
