import { HeaderService } from '@/services/header';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BackButton } from './back-button/back-button';
import { ThemeToggle } from './theme-toggle/theme-toggle';

@Component({
  selector: 'app-header',
  imports: [BackButton, ThemeToggle],
  templateUrl: './header.html',
  styleUrl: './header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  protected headerService = inject(HeaderService);
}
