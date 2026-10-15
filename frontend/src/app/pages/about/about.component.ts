import { Component } from '@angular/core';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({ 
  selector: 'app-about', 
  standalone: true, 
  imports: [TranslatePipe],
  templateUrl: './about.component.html', 
  styleUrls: ['./about.component.css'] 
})
export class AboutComponent {}
