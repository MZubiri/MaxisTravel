import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Injectable({providedIn: 'root'})
export class I18nService {
  currentLang = signal<string>('es');
  translations = signal<any>({});
  constructor(private http: HttpClient) { this.loadTranslations('es'); }
  setLanguage(lang: string) { this.currentLang.set(lang); this.loadTranslations(lang); }
  private loadTranslations(lang: string) { this.http.get(`assets/i18n/${lang}.json`).subscribe(data => this.translations.set(data)); }
  translate(key: string): string { const keys = key.split('.'); let val = this.translations(); for(const k of keys) { if(val) val = val[k]; else break; } return val || key; }
}
