import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-palette-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="admin-page-container">
      <div class="admin-page-header">
        <h2>🎨 Paleta de Colores</h2>
        <p class="subtitle">Personaliza la combinación cromática del sitio web en tiempo real.</p>
      </div>

      <div class="palette-grid">
        <div class="palette-card" [class.active]="theme.activePalette().id === 'hera'">
          <h3>Hera (Cálido Andino)</h3>
          <div class="colors">
            <div class="c" style="background:#C97F6C" title="Primario"></div>
            <div class="c" style="background:#C26148" title="Secundario"></div>
            <div class="c" style="background:#D6AA5C" title="Dorado Acento"></div>
          </div>
          <button (click)="theme.switchPalette('hera')" [class.btn-active]="theme.activePalette().id === 'hera'">
            {{ theme.activePalette().id === 'hera' ? '✓ Activa' : 'Activar' }}
          </button>
        </div>

        <div class="palette-card" [class.active]="theme.activePalette().id === 'persefone'">
          <h3>Perséfone (Esmeralda Místico)</h3>
          <div class="colors">
            <div class="c" style="background:#04474B" title="Primario"></div>
            <div class="c" style="background:#D3B9B9" title="Secundario"></div>
            <div class="c" style="background:#E4981E" title="Acento Ámbar"></div>
          </div>
          <button (click)="theme.switchPalette('persefone')" [class.btn-active]="theme.activePalette().id === 'persefone'">
            {{ theme.activePalette().id === 'persefone' ? '✓ Activa' : 'Activar' }}
          </button>
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
    .palette-grid {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
    }
    .palette-card {
      background: white;
      padding: 24px;
      border-radius: 16px;
      border: 2px solid #E2E8F0;
      width: 100%;
      max-width: 280px;
      text-align: center;
      box-shadow: 0 4px 15px rgba(0,0,0,0.04);
      transition: all 0.2s;
    }
    .palette-card.active {
      border-color: var(--color-primary, #C97F6C);
      box-shadow: 0 8px 25px rgba(201, 127, 108, 0.2);
    }
    .palette-card h3 {
      font-family: 'Outfit', sans-serif;
      font-size: 1.15rem;
      margin: 0 0 12px 0;
      color: #1A1A2E;
    }
    .colors {
      display: flex;
      justify-content: center;
      gap: 12px;
      margin: 18px 0;
    }
    .c {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(0,0,0,0.15);
    }
    button {
      background: var(--color-primary, #C97F6C);
      color: white;
      border: none;
      padding: 10px 22px;
      border-radius: 10px;
      font-weight: 700;
      cursor: pointer;
      width: 100%;
      transition: all 0.2s;
    }
    button:hover {
      filter: brightness(0.95);
    }
    .btn-active {
      background: #10B981;
    }
    @media (max-width: 600px) {
      .admin-page-container {
        padding: 20px 16px;
      }
      .palette-card {
        max-width: 100%;
      }
    }
  `]
})
export class PaletteSelectorComponent {
  constructor(public theme: ThemeService) {}
}
