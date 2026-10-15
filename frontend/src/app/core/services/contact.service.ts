import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone: string;
  tourInterest?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface ContactMessageCreate {
  name: string;
  email: string;
  phone: string;
  tourInterest?: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class ContactService {
  private apiUrl = environment.apiUrl;
  messagesSignal = signal<ContactMessage[]>([]);
  unreadCount = signal<number>(0);

  constructor(private http: HttpClient) {}

  sendMessage(dto: ContactMessageCreate): Observable<any> {
    return this.http.post(`${this.apiUrl}/contact`, dto).pipe(
      catchError(err => {
        console.warn('API error sending contact message, saving locally:', err);
        const localMsg: ContactMessage = {
          id: Date.now(),
          ...dto,
          isRead: false,
          createdAt: new Date().toISOString()
        };
        const current = this.getLocalMessages();
        current.unshift(localMsg);
        localStorage.setItem('maxis_contact_messages', JSON.stringify(current));
        return of({ success: true, local: true });
      })
    );
  }

  getAdminMessages(): Observable<ContactMessage[]> {
    return this.http.get<ContactMessage[]>(`${this.apiUrl}/admin/messages`).pipe(
      tap(messages => {
        this.messagesSignal.set(messages);
        this.updateUnreadCount(messages);
      }),
      catchError(err => {
        console.warn('API error fetching messages, falling back to local storage:', err);
        const local = this.getLocalMessages();
        this.messagesSignal.set(local);
        this.updateUnreadCount(local);
        return of(local);
      })
    );
  }

  markAsRead(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/admin/messages/${id}/read`, {}).pipe(
      tap(() => {
        const updated = this.messagesSignal().map(m => m.id === id ? { ...m, isRead: true } : m);
        this.messagesSignal.set(updated);
        this.updateUnreadCount(updated);
      }),
      catchError(() => {
        const local = this.getLocalMessages().map(m => m.id === id ? { ...m, isRead: true } : m);
        localStorage.setItem('maxis_contact_messages', JSON.stringify(local));
        this.messagesSignal.set(local);
        this.updateUnreadCount(local);
        return of(true);
      })
    );
  }

  private updateUnreadCount(messages: ContactMessage[]) {
    const unread = messages.filter(m => !m.isRead).length;
    this.unreadCount.set(unread);
  }

  private getLocalMessages(): ContactMessage[] {
    const raw = localStorage.getItem('maxis_contact_messages');
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }
}
