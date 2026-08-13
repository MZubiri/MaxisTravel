import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  contact = { name: '', email: '', phone: '', tour: '', message: '' };
  mapUrl: SafeResourceUrl;
  
  constructor(private sanitizer: DomSanitizer) {
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://maps.google.com/maps?q=-13.5319,-71.9675&z=15&output=embed');
  }

  sendWhatsApp() {
    const text = `Hola MaxisTravel! Soy ${this.contact.name}, me interesa el tour ${this.contact.tour || 'General'}. ${this.contact.message}`;
    window.open(`https://wa.me/51920698122?text=${encodeURIComponent(text)}`, '_blank');
  }
}
