import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TourService } from '../../core/services/tour.service';
import { ContactService } from '../../core/services/contact.service';
import { ThemeService } from '../../core/services/theme.service';
import { PaymentService } from '../../core/services/payment.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <div class="dash-header">
        <h1>📊 Resumen General</h1>
        <p class="subtitle">Estado en tiempo real del sitio web y panel de control de MaxisTravel.</p>
      </div>

      <div class="stat-grid">
        <div class="stat-card">
          <div class="stat-icon-wrapper tours-icon">🗺️</div>
          <div class="stat-info">
            <h3>{{ activeToursCount }}</h3>
            <p>Tours Publicados</p>
          </div>
          <a routerLink="/admin/tours" class="stat-link">Administrar ➔</a>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrapper bookings-icon">💳</div>
          <div class="stat-info">
            <h3>{{ paymentService.bookings().length }}</h3>
            <p>Reservas & Pagos MP</p>
          </div>
          <a routerLink="/admin/reservas" class="stat-link">Ver Reservas ➔</a>
        </div>

        <div class="stat-card" [class.highlight-alert]="contactService.unreadCount() > 0">
          <div class="stat-icon-wrapper msg-icon">📬</div>
          <div class="stat-info">
            <h3>{{ contactService.unreadCount() }}</h3>
            <p>Mensajes Sin Leer</p>
          </div>
          <a routerLink="/admin/mensajes" class="stat-link">Ver Consultas ➔</a>
        </div>

        <div class="stat-card">
          <div class="stat-icon-wrapper palette-icon">🎨</div>
          <div class="stat-info">
            <h3>{{ themeService.activePalette().name }}</h3>
            <p>Paleta de Color Activa</p>
          </div>
          <a routerLink="/admin/paleta" class="stat-link">Cambiar ➔</a>
        </div>
      </div>

      <div class="quick-section">
        <h2>Accesos Rápidos</h2>
        <div class="action-cards-grid">
          <a routerLink="/admin/reservas" class="action-card">
            <span class="action-icon">💳</span>
            <div class="action-text">
              <strong>Reservas & Pagos</strong>
              <span>Gestionar compras de Mercado Pago y coordinar viajes</span>
            </div>
          </a>

          <a routerLink="/admin/tours" class="action-card">
            <span class="action-icon">➕</span>
            <div class="action-text">
              <strong>Nuevo Tour</strong>
              <span>Crear o editar paquetes turísticos e itinerarios</span>
            </div>
          </a>

          <a routerLink="/admin/mensajes" class="action-card">
            <span class="action-icon">💬</span>
            <div class="action-text">
              <strong>Bandeja de Entrada</strong>
              <span>Responder consultas de clientes por WhatsApp o email</span>
            </div>
          </a>

          <a routerLink="/admin/galeria" class="action-card">
            <span class="action-icon">🖼️</span>
            <div class="action-text">
              <strong>Galería & Carrusel</strong>
              <span>Subir imágenes y gestionar carrusel de inicio</span>
            </div>
          </a>

          <a routerLink="/admin/password" class="action-card">
            <span class="action-icon">🔑</span>
            <div class="action-text">
              <strong>Seguridad</strong>
              <span>Actualizar clave de acceso de administración</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 30px;
      font-family: 'DM Sans', sans-serif;
    }
    .dash-header {
      margin-bottom: 24px;
    }
    .dash-header h1 {
      font-family: 'Outfit', sans-serif;
      font-size: 1.8rem;
      color: #1A1A2E;
      margin: 0 0 6px 0;
    }
    .subtitle {
      color: #64748B;
      font-size: 0.95rem;
      margin: 0;
    }

    .stat-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 20px;
      margin-bottom: 36px;
    }
    .stat-card {
      background: white;
      padding: 24px;
      border-radius: 18px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.04);
      border: 1px solid #E2E8F0;
      display: flex;
      flex-direction: column;
      position: relative;
      transition: transform 0.2s;
    }
    .stat-card:hover { transform: translateY(-3px); }
    .stat-icon-wrapper {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      margin-bottom: 16px;
    }
    .tours-icon { background: #FEF3C7; }
    .bookings-icon { background: #DCFCE7; }
    .msg-icon { background: #FEE2E2; }
    .palette-icon { background: #EDE9FE; }

    .stat-info h3 {
      font-size: 2.2rem;
      font-weight: 800;
      color: #1A1A2E;
      margin: 0 0 4px 0;
    }
    .stat-info p {
      color: #64748B;
      font-size: 0.9rem;
      margin: 0 0 16px 0;
    }
    .stat-link {
      color: var(--color-primary, #C97F6C);
      font-weight: 700;
      font-size: 0.85rem;
      text-decoration: none;
      margin-top: auto;
    }
    .highlight-alert {
      border-color: #FCA5A5;
      background: #FFFBFB;
    }

    .quick-section h2 {
      font-family: 'Outfit', sans-serif;
      font-size: 1.3rem;
      color: #1A1A2E;
      margin: 0 0 18px 0;
    }
    .action-cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 16px;
    }
    .action-card {
      background: white;
      border: 1px solid #E2E8F0;
      border-radius: 14px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      text-decoration: none;
      transition: all 0.2s;
    }
    .action-card:hover {
      border-color: var(--color-primary, #C97F6C);
      box-shadow: 0 4px 14px rgba(0,0,0,0.06);
      transform: translateY(-2px);
    }
    .action-icon {
      font-size: 1.8rem;
    }
    .action-text {
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .action-text strong {
      color: #1A1A2E;
      font-size: 1rem;
    }
    .action-text span {
      color: #64748B;
      font-size: 0.82rem;
      line-height: 1.3;
    }

    @media (max-width: 768px) {
      .dashboard-container { padding: 20px 16px; }
      .dash-header h1 { font-size: 1.5rem; }
      .stat-grid { grid-template-columns: 1fr; gap: 14px; margin-bottom: 24px; }
      .action-cards-grid { grid-template-columns: 1fr; gap: 12px; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  activeToursCount = 0;

  constructor(
    private tourService: TourService,
    public contactService: ContactService,
    public themeService: ThemeService,
    public paymentService: PaymentService
  ) {}

  ngOnInit() {
    this.tourService.getTours().subscribe(tours => {
      this.activeToursCount = tours.length;
    });
    this.contactService.getAdminMessages().subscribe();
    this.paymentService.getAdminBookings().subscribe();
  }
}
