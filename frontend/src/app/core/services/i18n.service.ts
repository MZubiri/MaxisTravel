import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class I18nService {
  currentLang = signal<string>('es');
  translations = signal<any>({});
  onLanguageChanged = new Subject<string>();

  constructor(private http: HttpClient) {
    const saved = localStorage.getItem('maxis_lang') || 'es';
    this.currentLang.set(saved);
    this.loadTranslations(saved);
  }

  setLanguage(lang: string) {
    this.currentLang.set(lang);
    localStorage.setItem('maxis_lang', lang);
    this.loadTranslations(lang);
    this.onLanguageChanged.next(lang);
  }

  toggleLanguage() {
    const next = this.currentLang() === 'es' ? 'en' : 'es';
    this.setLanguage(next);
  }

  private loadTranslations(lang: string) {
    this.http.get<any>(`/assets/i18n/${lang}.json?t=${Date.now()}`).subscribe({
      next: (data) => this.translations.set(data),
      error: () => console.warn(`Could not load translations for ${lang}`)
    });
  }

  translate(key: string): string {
    const keys = key.split('.');
    let val = this.translations();
    for (const k of keys) {
      if (val && typeof val === 'object') {
        val = val[k];
      } else {
        return key;
      }
    }
    return val || key;
  }
}
