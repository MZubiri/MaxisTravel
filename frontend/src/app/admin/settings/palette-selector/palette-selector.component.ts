import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/services/theme.service';

@Component({ selector: 'app-palette-selector', standalone: true, imports: [CommonModule], template: `
  <h2>Paleta de Colores</h2>
  <div class="palette-grid">
    <div class="palette-card" [class.active]="theme.activePalette().id === 'hera'">
      <h3>Hera</h3>
      <div class="colors"><div class="c" style="background:#C97F6C"></div><div class="c" style="background:#C26148"></div><div class="c" style="background:#D6AA5C"></div></div>
      <button (click)="theme.switchPalette('hera')">Activar</button>
    </div>
    <div class="palette-card" [class.active]="theme.activePalette().id === 'persefone'">
      <h3>Perséfone</h3>
      <div class="colors"><div class="c" style="background:#04474B"></div><div class="c" style="background:#D3B9B9"></div><div class="c" style="background:#E4981E"></div></div>
      <button (click)="theme.switchPalette('persefone')">Activar</button>
    </div>
  </div>
`, styles: [`
  .palette-grid { display: flex; gap: 20px; }
  .palette-card { background: white; padding: 20px; border-radius: 8px; border: 2px solid transparent; width: 250px; text-align: center; }
  .palette-card.active { border-color: var(--color-primary); }
  .colors { display: flex; justify-content: center; gap: 10px; margin: 15px 0; }
  .c { width: 30px; height: 30px; border-radius: 50%; }
  button { background: var(--color-primary); color: white; border: none; padding: 8px 15px; border-radius: 4px; cursor: pointer; }
`]})
export class PaletteSelectorComponent {
  constructor(public theme: ThemeService) {}
}
