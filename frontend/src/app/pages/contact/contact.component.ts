import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ContactService } from '../../core/services/contact.service';

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
  isSubmitting = false;
  isSubmitted = false;
  
  constructor(
    private sanitizer: DomSanitizer,
    private contactService: ContactService
  ) {
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl('https://maps.google.com/maps?q=-13.5319,-71.9675&z=15&output=embed');
  }

  submitForm() {
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    this.contactService.sendMessage({
      name: this.contact.name,
      email: this.contact.email,
      phone: this.contact.phone,
      tourInterest: this.contact.tour,
      message: this.contact.message
    }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.isSubmitted = true;
      },
      error: () => {
        this.isSubmitting = false;
        this.isSubmitted = true; // Graceful fallback
      }
    });
  }

  sendWhatsApp() {
    const text = `Hola MaxisTravel! Soy ${this.contact.name}, me interesa el tour ${this.contact.tour || 'General'}. ${this.contact.message}`;
    window.open(`https://wa.me/51920698122?text=${encodeURIComponent(text)}`, '_blank');
  }

  resetForm() {
    this.contact = { name: '', email: '', phone: '', tour: '', message: '' };
    this.isSubmitted = false;
  }
}

