import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { ContactService } from '../../core/services/contact.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit {
  constructor(
    public authService: AuthService,
    public contactService: ContactService
  ) {}

  ngOnInit() {
    this.contactService.getAdminMessages().subscribe();
  }

  logout() {
    this.authService.logout();
  }
}

