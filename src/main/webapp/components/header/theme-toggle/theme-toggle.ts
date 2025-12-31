import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ThemeService } from '@/services/theme';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-theme-toggle',
  imports: [ButtonModule],
  templateUrl: './theme-toggle.html',
  styleUrl: './theme-toggle.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeToggle {
  protected themeService = inject(ThemeService);

  protected ariaLabel = computed(() =>
    this.themeService.isDarkMode() ? 'Alternar para tema claro' : 'Alternar para tema escuro'
  );
}
