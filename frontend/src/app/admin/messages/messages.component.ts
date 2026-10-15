import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactService, ContactMessage } from '../../core/services/contact.service';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-page-container">
      <div class="admin-page-header">
        <div>
          <h2>📬 Mensajes y Consultas</h2>
          <p class="subtitle">Gestiona las consultas enviadas por los viajeros desde el formulario web.</p>
        </div>
        <div class="header-badges">
          <span class="badge-unread" *ngIf="contactService.unreadCount() > 0">
            🔔 {{ contactService.unreadCount() }} sin leer
          </span>
          <button class="btn btn-refresh" (click)="loadMessages()">
            🔄 Actualizar
          </button>
        </div>
      </div>

      <!-- Filters & Search -->
      <div class="filter-bar">
        <div class="tabs">
          <button 
            [class.active]="filter === 'all'" 
            (click)="setFilter('all')">
            Todos ({{ messages.length }})
          </button>
          <button 
            [class.active]="filter === 'unread'" 
            (click)="setFilter('unread')">
            No leídos ({{ unreadMessages.length }})
          </button>
          <button 
            [class.active]="filter === 'read'" 
            (click)="setFilter('read')">
            Leídos ({{ readMessages.length }})
          </button>
        </div>
        <input 
          type="text" 
          placeholder="🔍 Buscar por nombre, email o tour..." 
          [(ngModel)]="searchTerm" 
          class="search-input">
      </div>

      <!-- Messages Table -->
      <div class="table-card">
        <div *ngIf="filteredMessages.length === 0" class="empty-state">
          <span class="empty-icon">📭</span>
          <h3>No hay mensajes para mostrar</h3>
          <p>Cuando los viajeros envíen consultas a través del formulario de contacto, aparecerán aquí.</p>
        </div>

        <table *ngIf="filteredMessages.length > 0" class="admin-table">
          <thead>
            <tr>
              <th>Estado</th>
              <th>Fecha</th>
              <th>Viajero</th>
              <th>Tour Interés</th>
              <th>Mensaje</th>
              <th class="text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let msg of filteredMessages" [class.unread-row]="!msg.isRead">
              <td>
                <span class="status-pill" [class.pill-unread]="!msg.isRead" [class.pill-read]="msg.isRead">
                  {{ msg.isRead ? 'Leído' : 'Nuevo' }}
                </span>
              </td>
              <td class="date-col">
                {{ msg.createdAt | date:'shortDate' }}
                <small class="time-text">{{ msg.createdAt | date:'shortTime' }}</small>
              </td>
              <td>
                <strong>{{ msg.name }}</strong>
                <div class="contact-links">
                  <a [href]="'mailto:' + msg.email" class="sublink">✉️ {{ msg.email }}</a>
                  <a *ngIf="msg.phone" [href]="'tel:' + msg.phone" class="sublink">📞 {{ msg.phone }}</a>
                </div>
              </td>
              <td>
                <span class="tour-tag">{{ msg.tourInterest || 'General' }}</span>
              </td>
              <td class="message-preview" (click)="openDetail(msg)" title="Clic para ver mensaje completo">
                {{ msg.message | slice:0:70 }}{{ msg.message.length > 70 ? '...' : '' }}
              </td>
              <td class="text-right action-col">
                <button 
                  class="btn-icon" 
                  (click)="openDetail(msg)" 
                  title="Ver detalle">
                  👁️
                </button>
                <a 
                  *ngIf="msg.phone"
                  [href]="getWhatsAppLink(msg)" 
                  target="_blank" 
                  class="btn-icon btn-wa" 
                  title="Responder por WhatsApp">
                  💬
                </a>
                <button 
                  *ngIf="!msg.isRead" 
                  (click)="markAsRead(msg)" 
                  class="btn-action-read" 
                  title="Marcar como leído">
                  ✓ Marcar Leído
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Detail Modal -->
      <div class="modal-backdrop" *ngIf="selectedMessage">
        <div class="modal-card">
          <div class="modal-header">
            <h3>Detalle del Mensaje</h3>
            <button class="btn-close" (click)="selectedMessage = null">✕</button>
          </div>
          <div class="modal-body">
            <div class="meta-row">
              <div>
                <label>Nombre:</label>
                <p><strong>{{ selectedMessage.name }}</strong></p>
              </div>
              <div>
                <label>Fecha:</label>
                <p>{{ selectedMessage.createdAt | date:'medium' }}</p>
              </div>
            </div>
            <div class="meta-row">
              <div>
                <label>Email:</label>
                <p><a [href]="'mailto:' + selectedMessage.email">{{ selectedMessage.email }}</a></p>
              </div>
              <div>
                <label>Teléfono:</label>
                <p>{{ selectedMessage.phone || 'No especificado' }}</p>
              </div>
            </div>
            <div class="meta-row">
              <div>
                <label>Tour de interés:</label>
                <p><span class="tour-tag">{{ selectedMessage.tourInterest || 'Consulta General' }}</span></p>
              </div>
            </div>
            <div class="message-content">
              <label>Mensaje:</label>
              <div class="message-box">{{ selectedMessage.message }}</div>
            </div>
          </div>
          <div class="modal-footer">
            <a 
              *ngIf="selectedMessage.phone" 
              [href]="getWhatsAppLink(selectedMessage)" 
              target="_blank" 
              class="btn btn-wa-reply">
              💬 Responder por WhatsApp
            </a>
            <a 
              [href]="'mailto:' + selectedMessage.email + '?subject=Respuesta%20MaxisTravel%20-%20' + (selectedMessage.tourInterest || 'Consulta')" 
              class="btn btn-secondary">
              ✉️ Responder por Email
            </a>
            <button class="btn btn-primary" (click)="selectedMessage = null">Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .admin-page-container {
      padding: 30px;
      font-family: 'DM Sans', sans-serif;
    }
    .admin-page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .admin-page-header h2 {
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
    .header-badges {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .badge-unread {
      background: #FEE2E2;
      color: #DC2626;
      font-weight: 700;
      font-size: 0.85rem;
      padding: 6px 14px;
      border-radius: 20px;
      border: 1px solid #FCA5A5;
    }
    .btn-refresh {
      background: #FFFFFF;
      border: 1px solid #CBD5E1;
      border-radius: 10px;
      padding: 8px 16px;
      font-weight: 600;
      font-size: 0.85rem;
      cursor: pointer;
      color: #475569;
    }
    .btn-refresh:hover { background: #F1F5F9; }

    .filter-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 16px;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }
    .tabs {
      display: flex;
      gap: 8px;
    }
    .tabs button {
      background: #FFFFFF;
      border: 1px solid #CBD5E1;
      padding: 8px 16px;
      border-radius: 10px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      color: #64748B;
      transition: all 0.2s;
    }
    .tabs button.active {
      background: #C97F6C;
      color: white;
      border-color: #C97F6C;
    }
    .search-input {
      padding: 10px 16px;
      border: 1px solid #CBD5E1;
      border-radius: 10px;
      min-width: 280px;
      font-size: 0.9rem;
    }

    .table-card {
      background: #FFFFFF;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.04);
      border: 1px solid #E2E8F0;
      overflow: hidden;
    }
    .empty-state {
      padding: 60px 20px;
      text-align: center;
      color: #64748B;
    }
    .empty-icon { font-size: 3rem; display: block; margin-bottom: 12px; }
    .empty-state h3 { color: #1A1A2E; margin: 0 0 8px 0; }
    .empty-state p { margin: 0; font-size: 0.9rem; }

    .admin-table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }
    .admin-table th {
      background: #F8FAFC;
      padding: 14px 18px;
      font-size: 0.8rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #64748B;
      border-bottom: 1px solid #E2E8F0;
    }
    .admin-table td {
      padding: 16px 18px;
      border-bottom: 1px solid #F1F5F9;
      font-size: 0.9rem;
      color: #334155;
    }
    .unread-row {
      background: #FFFBF9;
      font-weight: 500;
    }
    .date-col { font-size: 0.85rem; color: #64748B; }
    .time-text { display: block; color: #94A3B8; font-size: 0.75rem; }

    .contact-links {
      display: flex;
      flex-direction: column;
      gap: 2px;
      margin-top: 4px;
    }
    .sublink {
      font-size: 0.8rem;
      color: #64748B;
      text-decoration: none;
    }
    .sublink:hover { color: #C97F6C; }

    .status-pill {
      font-size: 0.75rem;
      font-weight: 700;
      padding: 4px 10px;
      border-radius: 12px;
    }
    .pill-unread { background: #FEE2E2; color: #DC2626; }
    .pill-read { background: #E2E8F0; color: #64748B; }

    .tour-tag {
      background: #F1F5F9;
      color: #475569;
      font-size: 0.8rem;
      padding: 4px 10px;
      border-radius: 8px;
      font-weight: 600;
    }

    .message-preview {
      cursor: pointer;
      color: #475569;
      max-width: 250px;
    }
    .message-preview:hover { color: #C97F6C; }

    .action-col { white-space: nowrap; }
    .text-right { text-align: right; }

    .btn-icon {
      background: #F1F5F9;
      border: 1px solid #CBD5E1;
      border-radius: 8px;
      padding: 6px 10px;
      cursor: pointer;
      margin-left: 6px;
      font-size: 0.9rem;
    }
    .btn-icon:hover { background: #E2E8F0; }
    .btn-wa { background: #DCFCE7; border-color: #86EFAC; text-decoration: none; display: inline-block; }

    .btn-action-read {
      background: #C97F6C;
      color: white;
      border: none;
      padding: 6px 12px;
      border-radius: 8px;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      margin-left: 8px;
    }
    .btn-action-read:hover { background: #C26148; }

    /* Modal */
    .modal-backdrop {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.5);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      padding: 20px;
    }
    .modal-card {
      background: white;
      border-radius: 20px;
      max-width: 550px;
      width: 100%;
      padding: 28px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.15);
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .modal-header h3 { margin: 0; font-size: 1.3rem; color: #1A1A2E; }
    .btn-close {
      background: none; border: none; font-size: 1.2rem; cursor: pointer; color: #94A3B8;
    }
    .meta-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 14px;
    }
    .meta-row label, .message-content label {
      font-size: 0.75rem;
      font-weight: 700;
      color: #64748B;
      text-transform: uppercase;
      display: block;
      margin-bottom: 4px;
    }
    .meta-row p { margin: 0; font-size: 0.95rem; color: #1E293B; }
    .message-box {
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      padding: 16px;
      font-size: 0.95rem;
      color: #334155;
      line-height: 1.5;
      white-space: pre-wrap;
    }
    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 24px;
      flex-wrap: wrap;
    }
    .btn {
      padding: 10px 18px;
      border-radius: 10px;
      font-weight: 600;
      font-size: 0.9rem;
      cursor: pointer;
      text-decoration: none;
    }
    .btn-wa-reply { background: #25D366; color: white; border: none; }
    .btn-secondary { background: #F1F5F9; color: #475569; border: 1px solid #CBD5E1; }
    .btn-primary { background: #1A1A2E; color: white; border: none; }
  `]
})
export class MessagesComponent implements OnInit {
  messages: ContactMessage[] = [];
  filter: 'all' | 'unread' | 'read' = 'all';
  searchTerm = '';
  selectedMessage: ContactMessage | null = null;

  constructor(public contactService: ContactService) {}

  ngOnInit() {
    this.loadMessages();
  }

  loadMessages() {
    this.contactService.getAdminMessages().subscribe(msgs => {
      this.messages = msgs;
    });
  }

  get unreadMessages() {
    return this.messages.filter(m => !m.isRead);
  }

  get readMessages() {
    return this.messages.filter(m => m.isRead);
  }

  get filteredMessages() {
    let list = this.messages;
    if (this.filter === 'unread') list = this.unreadMessages;
    else if (this.filter === 'read') list = this.readMessages;

    if (this.searchTerm.trim()) {
      const q = this.searchTerm.toLowerCase();
      list = list.filter(m => 
        m.name.toLowerCase().includes(q) || 
        m.email.toLowerCase().includes(q) || 
        (m.tourInterest && m.tourInterest.toLowerCase().includes(q)) ||
        m.message.toLowerCase().includes(q)
      );
    }

    return list;
  }

  setFilter(f: 'all' | 'unread' | 'read') {
    this.filter = f;
  }

  openDetail(msg: ContactMessage) {
    this.selectedMessage = msg;
    if (!msg.isRead) {
      this.markAsRead(msg);
    }
  }

  markAsRead(msg: ContactMessage) {
    this.contactService.markAsRead(msg.id).subscribe(() => {
      msg.isRead = true;
    });
  }

  getWhatsAppLink(msg: ContactMessage): string {
    const phone = msg.phone.replace(/[^0-9]/g, '');
    const cleanPhone = phone.startsWith('51') ? phone : `51${phone}`;
    const text = `Hola ${msg.name}, gracias por escribir a MaxisTravel respecto a tu consulta sobre ${msg.tourInterest || 'nuestros tours'}. ¿En qué podemos ayudarte?`;
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  }
}
