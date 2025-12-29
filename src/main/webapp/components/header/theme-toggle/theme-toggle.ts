import { Component, inject } from '@angular/core';
import { ThemeService } from '../../../services/theme';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-theme-toggle',
  imports: [ButtonModule],
  templateUrl: './theme-toggle.html',
  styleUrl: './theme-toggle.scss',
})
export class ThemeToggle {
  protected themeService = inject(ThemeService);
}
