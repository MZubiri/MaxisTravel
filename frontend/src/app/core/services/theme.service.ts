import { Injectable, signal } from '@angular/core';
import { ColorPalette } from '../models/settings.model';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private palettes: Record<string, ColorPalette> = {
    hera: { id: 'hera', name: 'Hera', primary: '#C97F6C', secondary: '#C26148', accent: '#D6AA5C', light: '#EDDEE0', dark: '#3D2B1F', bg: '#FFF8F5' },
    persefone: { id: 'persefone', name: 'Perséfone', primary: '#04474B', secondary: '#D3B9B9', accent: '#E4981E', light: '#E7E7E5', dark: '#022D30', bg: '#F2F2F2' }
  };

  activePalette = signal<ColorPalette>(this.palettes['hera']);

  constructor() {
    this.loadTheme();
  }

  loadTheme() {
    const saved = localStorage.getItem('maxis_active_palette');
    const paletteId = saved && this.palettes[saved] ? saved : 'hera';
    this.switchPalette(paletteId);
  }

  switchPalette(id: string) {
    if (this.palettes[id]) {
      this.activePalette.set(this.palettes[id]);
      this.applyPalette(this.palettes[id]);
      localStorage.setItem('maxis_active_palette', id);
    }
  }

  private applyPalette(p: ColorPalette) {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', p.primary);
    root.style.setProperty('--color-secondary', p.secondary);
    root.style.setProperty('--color-accent', p.accent);
    root.style.setProperty('--color-light', p.light);
    root.style.setProperty('--color-dark', p.dark);
    root.style.setProperty('--color-bg', p.bg);
  }
}
