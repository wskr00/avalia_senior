import { Component, ChangeDetectionStrategy } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-back-button',
  imports: [ButtonModule, RouterLink],
  templateUrl: './back-button.html',
  styleUrl: './back-button.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackButton {}
