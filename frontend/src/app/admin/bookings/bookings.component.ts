import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentService, Booking } from '../../core/services/payment.service';

@Component({
  selector: 'app-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bookings-container">
      <div class="page-header">
        <div class="header-titles">
          <h1>💳 Gestión de Reservas y Pagos</h1>
          <p class="subtitle">Supervisa las transacciones en línea de Mercado Pago y reservas de tours.</p>
        </div>
        <button (click)="loadBookings()" class="btn-refresh" [disabled]="loading()">
          <span class="refresh-icon" [class.spinning]="loading()">🔄</span> Actualizar
        </button>
      </div>

      <!-- Métricas Resumen -->
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-icon total-icon">📋</div>
          <div class="metric-data">
            <span class="metric-number">{{ allBookings().length }}</span>
            <span class="metric-label">Total Reservas</span>
          </div>
        </div>

        <div class="metric-card approved-card">
          <div class="metric-icon approved-icon">✅</div>
          <div class="metric-data">
            <span class="metric-number">{{ approvedCount() }}</span>
            <span class="metric-label">Pagos Aprobados ($ {{ totalApprovedAmount() | number:'1.2-2' }})</span>
          </div>
        </div>

        <div class="metric-card pending-card">
          <div class="metric-icon pending-icon">⏳</div>
          <div class="metric-data">
            <span class="metric-number">{{ pendingCount() }}</span>
            <span class="metric-label">En Proceso / Pendientes</span>
          </div>
        </div>

        <div class="metric-card rejected-card">
          <div class="metric-icon rejected-icon">❌</div>
          <div class="metric-data">
            <span class="metric-number">{{ rejectedCount() }}</span>
            <span class="metric-label">Rechazadas / Canceladas</span>
          </div>
        </div>
      </div>

      <!-- Filtros -->
      <div class="filter-bar">
        <div class="filter-tabs">
          <button 
            *ngFor="let tab of filterTabs" 
            class="tab-btn" 
            [class.active]="selectedFilter() === tab.id"
            (click)="setFilter(tab.id)">
            {{ tab.label }}
            <span class="tab-badge" *ngIf="tab.count > 0">{{ tab.count }}</span>
          </button>
        </div>

        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input 
            type="text" 
            [(ngModel)]="searchQuery" 
            placeholder="Buscar por cliente, tour o email..." 
            class="search-input">
        </div>
      </div>

      <!-- Estado de carga -->
      <div *ngIf="loading()" class="loading-state">
        <div class="spinner"></div>
        <p>Cargando reservas y transacciones...</p>
      </div>

      <!-- Lista / Tabla de Reservas -->
      <div *ngIf="!loading() && filteredBookings().length > 0" class="table-card">
        <div class="table-responsive">
          <table class="bookings-table">
            <thead>
              <tr>
                <th>ID & Fecha</th>
                <th>Tour</th>
                <th>Cliente</th>
                <th>Viaje & Pasajeros</th>
                <th>Monto</th>
                <th>Estado</th>
                <th>Ref / Mercado Pago</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let b of filteredBookings()" [class.row-approved]="b.status === 'Approved'">
                <td class="col-id">
                  <strong>#{{ b.id }}</strong>
                  <span class="date-text">{{ b.createdAt | date:'dd/MM/yyyy HH:mm' }}</span>
                </td>
                <td class="col-tour">
                  <div class="tour-cell">
                    <span class="tour-name">{{ b.tourName }}</span>
                    <span class="tour-id-tag">{{ b.tourId }}</span>
                  </div>
                </td>
                <td class="col-customer">
                  <div class="customer-info">
                    <strong>{{ b.customerName }}</strong>
                    <span class="email-text">{{ b.customerEmail }}</span>
                    <a 
                      *ngIf="b.customerPhone" 
                      [href]="getWhatsAppUrl(b.customerPhone, b.customerName, b.tourName)" 
                      target="_blank" 
                      class="btn-wa-direct" 
                      title="Chatear por WhatsApp">
                      📱 {{ b.customerPhone }}
                    </a>
                  </div>
                </td>
                <td class="col-travel">
                  <div class="travel-details">
                    <span>📅 {{ b.travelDate }}</span>
                    <span class="passengers-tag">👥 {{ b.passengers }} {{ b.passengers === 1 ? 'persona' : 'personas' }}</span>
                  </div>
                </td>
                <td class="col-amount">
                  <div class="amount-tag">
                    {{ b.currency }} {{ b.totalAmount | number:'1.2-2' }}
                  </div>
                </td>
                <td class="col-status">
                  <span class="badge" [ngClass]="getStatusBadgeClass(b.status)">
                    {{ getStatusLabel(b.status) }}
                  </span>
                </td>
                <td class="col-mp">
                  <div class="mp-info">
                    <span *ngIf="b.paymentId" class="mp-id">ID: {{ b.paymentId }}</span>
                    <span *ngIf="!b.paymentId" class="pref-id">Pref: {{ b.preferenceId | slice:0:10 }}...</span>
                    <span *ngIf="b.paymentMethod" class="method-tag">{{ b.paymentMethod | uppercase }}</span>
                  </div>
                </td>
                <td class="col-actions">
                  <div class="actions-group">
                    <button 
                      *ngIf="b.status !== 'Approved'" 
                      (click)="changeStatus(b, 'Approved')" 
                      class="btn-action btn-approve" 
                      title="Aprobar reserva y enviar confirmación por email">
                      ✅ Aprobar
                    </button>
                    <button 
                      *ngIf="b.status !== 'Cancelled'" 
                      (click)="changeStatus(b, 'Cancelled')" 
                      class="btn-action btn-cancel" 
                      title="Marcar como cancelado">
                      🚫 Cancelar
                    </button>
                    <button 
                      (click)="deleteBooking(b)" 
                      class="btn-action btn-delete" 
                      title="Eliminar registro">
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Estado Vacío -->
      <div *ngIf="!loading() && filteredBookings().length === 0" class="empty-state">
        <div class="empty-icon">📭</div>
        <h3>No se encontraron reservas</h3>
        <p *ngIf="searchQuery">No hay resultados para la búsqueda "{{ searchQuery }}".</p>
        <p *ngIf="!searchQuery">Aún no hay reservas registradas en esta categoría.</p>
      </div>
    </div>
  `,
  styles: [`
    .bookings-container {
      padding: 30px;
      font-family: 'DM Sans', sans-serif;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 16px;
    }
    .header-titles h1 {
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
    .btn-refresh {
      background: white;
      border: 1px solid #CBD5E1;
      padding: 10px 18px;
      border-radius: 10px;
      font-weight: 600;
      color: #334155;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s;
    }
    .btn-refresh:hover {
      background: #F8FAFC;
      border-color: #94A3B8;
    }
    .refresh-icon.spinning {
      animation: spin 1s linear infinite;
    }
    @keyframes spin { 100% { transform: rotate(360deg); } }

    /* Metricas */
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 18px;
      margin-bottom: 28px;
    }
    .metric-card {
      background: white;
      border: 1px solid #E2E8F0;
      border-radius: 16px;
      padding: 20px;
      display: flex;
      align-items: center;
      gap: 16px;
      box-shadow: 0 4px 14px rgba(0,0,0,0.03);
    }
    .metric-icon {
      width: 48px;
      height: 48px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }
    .total-icon { background: #EEF2F6; }
    .approved-icon { background: #DCFCE7; }
    .pending-icon { background: #FEF3C7; }
    .rejected-icon { background: #FEE2E2; }
    
    .metric-data {
      display: flex;
      flex-direction: column;
    }
    .metric-number {
      font-size: 1.6rem;
      font-weight: 800;
      color: #1A1A2E;
    }
    .metric-label {
      font-size: 0.82rem;
      color: #64748B;
      font-weight: 500;
    }

    /* Filtros */
    .filter-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 20px;
    }
    .filter-tabs {
      display: flex;
      gap: 8px;
      background: #F1F5F9;
      padding: 4px;
      border-radius: 12px;
    }
    .tab-btn {
      background: transparent;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 0.88rem;
      font-weight: 600;
      color: #64748B;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s;
    }
    .tab-btn.active {
      background: white;
      color: #1A1A2E;
      box-shadow: 0 2px 6px rgba(0,0,0,0.06);
    }
    .tab-badge {
      background: #E2E8F0;
      font-size: 0.72rem;
      padding: 2px 6px;
      border-radius: 10px;
    }
    .search-box {
      position: relative;
      min-width: 280px;
    }
    .search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 0.9rem;
      color: #94A3B8;
    }
    .search-input {
      width: 100%;
      padding: 10px 12px 10px 36px;
      border: 1px solid #CBD5E1;
      border-radius: 10px;
      font-size: 0.9rem;
      outline: none;
      box-sizing: border-box;
    }
    .search-input:focus {
      border-color: var(--color-primary, #C97F6C);
    }

    /* Tabla */
    .table-card {
      background: white;
      border: 1px solid #E2E8F0;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.03);
      overflow: hidden;
    }
    .table-responsive {
      overflow-x: auto;
    }
    .bookings-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
      font-size: 0.88rem;
    }
    .bookings-table th {
      background: #F8FAFC;
      color: #475569;
      padding: 14px 16px;
      font-weight: 700;
      border-bottom: 1px solid #E2E8F0;
      white-space: nowrap;
    }
    .bookings-table td {
      padding: 14px 16px;
      border-bottom: 1px solid #F1F5F9;
      vertical-align: middle;
    }
    .bookings-table tr:hover {
      background: #FAFAFC;
    }

    .col-id strong {
      display: block;
      color: #1A1A2E;
    }
    .date-text {
      font-size: 0.78rem;
      color: #94A3B8;
    }

    .tour-cell .tour-name {
      display: block;
      font-weight: 700;
      color: #1A1A2E;
      max-width: 200px;
    }
    .tour-id-tag {
      font-size: 0.72rem;
      color: #64748B;
      background: #F1F5F9;
      padding: 2px 6px;
      border-radius: 4px;
    }

    .customer-info strong {
      display: block;
      color: #1A1A2E;
    }
    .email-text {
      display: block;
      font-size: 0.8rem;
      color: #64748B;
    }
    .btn-wa-direct {
      display: inline-block;
      margin-top: 4px;
      font-size: 0.78rem;
      color: #166534;
      background: #DCFCE7;
      padding: 2px 8px;
      border-radius: 6px;
      text-decoration: none;
      font-weight: 600;
    }
    .btn-wa-direct:hover {
      background: #BBF7D0;
    }

    .travel-details span {
      display: block;
      font-size: 0.82rem;
      color: #334155;
    }
    .passengers-tag {
      font-size: 0.75rem !important;
      color: #64748B !important;
    }

    .amount-tag {
      font-weight: 800;
      font-size: 0.95rem;
      color: #1A1A2E;
      white-space: nowrap;
    }

    /* Badges */
    .badge {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 8px;
      font-size: 0.76rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .badge-approved { background: #DCFCE7; color: #166534; }
    .badge-pending { background: #FEF3C7; color: #92400E; }
    .badge-inprocess { background: #E0E7FF; color: #3730A3; }
    .badge-rejected { background: #FEE2E2; color: #991B1B; }
    .badge-cancelled { background: #F1F5F9; color: #475569; }

    .mp-info span {
      display: block;
      font-size: 0.76rem;
    }
    .mp-id { color: #0284C7; font-weight: 600; }
    .pref-id { color: #64748B; }
    .method-tag {
      display: inline-block;
      background: #F1F5F9;
      padding: 1px 5px;
      border-radius: 4px;
      font-size: 0.7rem;
      margin-top: 2px;
    }

    /* Acciones */
    .actions-group {
      display: flex;
      gap: 6px;
      align-items: center;
    }
    .btn-action {
      border: none;
      padding: 6px 10px;
      border-radius: 6px;
      font-size: 0.78rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s;
    }
    .btn-approve {
      background: #DCFCE7;
      color: #166534;
    }
    .btn-approve:hover { background: #BBF7D0; }
    .btn-cancel {
      background: #FEE2E2;
      color: #991B1B;
    }
    .btn-cancel:hover { background: #FECACA; }
    .btn-delete {
      background: #F1F5F9;
      color: #64748B;
      padding: 6px 8px;
    }
    .btn-delete:hover { background: #E2E8F0; color: #EF4444; }

    /* Empty & Loading */
    .empty-state {
      text-align: center;
      padding: 60px 20px;
      background: white;
      border-radius: 16px;
      border: 1px solid #E2E8F0;
    }
    .empty-icon { font-size: 3rem; margin-bottom: 12px; }
    .empty-state h3 { font-size: 1.2rem; color: #1A1A2E; margin: 0 0 6px 0; }
    .empty-state p { color: #64748B; font-size: 0.9rem; margin: 0; }

    .loading-state {
      text-align: center;
      padding: 50px 20px;
    }
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #E2E8F0;
      border-top-color: var(--color-primary, #C97F6C);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 16px;
    }
  `]
})
export class BookingsComponent implements OnInit {
  loading = signal(false);
  selectedFilter = signal<'all' | 'Approved' | 'Pending' | 'Rejected'>('all');
  searchQuery = '';

  allBookings = computed(() => this.paymentService.bookings());

  approvedCount = computed(() => 
    this.allBookings().filter(b => b.status === 'Approved').length
  );

  totalApprovedAmount = computed(() => 
    this.allBookings()
      .filter(b => b.status === 'Approved')
      .reduce((sum, b) => sum + (b.totalAmount || 0), 0)
  );

  pendingCount = computed(() => 
    this.allBookings().filter(b => b.status === 'Pending' || b.status === 'InProcess').length
  );

  rejectedCount = computed(() => 
    this.allBookings().filter(b => b.status === 'Rejected' || b.status === 'Cancelled').length
  );

  get filterTabs() {
    return [
      { id: 'all' as const, label: 'Todas', count: this.allBookings().length },
      { id: 'Approved' as const, label: 'Aprobadas', count: this.approvedCount() },
      { id: 'Pending' as const, label: 'Pendientes', count: this.pendingCount() },
      { id: 'Rejected' as const, label: 'Rechazadas', count: this.rejectedCount() }
    ];
  }

  filteredBookings = computed(() => {
    let list = this.allBookings();
    const filter = this.selectedFilter();

    if (filter === 'Approved') {
      list = list.filter(b => b.status === 'Approved');
    } else if (filter === 'Pending') {
      list = list.filter(b => b.status === 'Pending' || b.status === 'InProcess');
    } else if (filter === 'Rejected') {
      list = list.filter(b => b.status === 'Rejected' || b.status === 'Cancelled');
    }

    if (this.searchQuery.trim()) {
      const q = this.searchQuery.toLowerCase();
      list = list.filter(b => 
        b.customerName?.toLowerCase().includes(q) ||
        b.customerEmail?.toLowerCase().includes(q) ||
        b.tourName?.toLowerCase().includes(q) ||
        b.tourId?.toLowerCase().includes(q) ||
        b.paymentId?.toLowerCase().includes(q)
      );
    }

    return list;
  });

  constructor(public paymentService: PaymentService) {}

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings() {
    this.loading.set(true);
    this.paymentService.getAdminBookings().subscribe({
      next: () => this.loading.set(false),
      error: () => this.loading.set(false)
    });
  }

  setFilter(filter: 'all' | 'Approved' | 'Pending' | 'Rejected') {
    this.selectedFilter.set(filter);
  }

  changeStatus(booking: Booking, newStatus: string) {
    if (confirm(`¿Deseas cambiar el estado de la reserva #${booking.id} a "${newStatus}"?`)) {
      this.paymentService.updateBookingStatus(booking.id, newStatus).subscribe();
    }
  }

  deleteBooking(booking: Booking) {
    if (confirm(`¿Estás seguro de eliminar el registro de la reserva #${booking.id}?`)) {
      this.paymentService.deleteBooking(booking.id).subscribe();
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'Approved': return 'badge-approved';
      case 'Pending': return 'badge-pending';
      case 'InProcess': return 'badge-inprocess';
      case 'Rejected': return 'badge-rejected';
      case 'Cancelled': return 'badge-cancelled';
      default: return 'badge-pending';
    }
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'Approved': return 'Aprobado';
      case 'Pending': return 'Pendiente';
      case 'InProcess': return 'En Proceso';
      case 'Rejected': return 'Rechazado';
      case 'Cancelled': return 'Cancelado';
      default: return status;
    }
  }

  getWhatsAppUrl(phone: string, customerName: string, tourName: string): string {
    const cleanPhone = phone.replace(/[^0-9]/g, '');
    const message = encodeURIComponent(`Hola ${customerName}, te saludamos de MaxisTravel Cusco sobre tu reserva para el tour "${tourName}".`);
    return `https://wa.me/${cleanPhone}?text=${message}`;
  }
}
