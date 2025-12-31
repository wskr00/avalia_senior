import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { HeaderService } from '@/services/header';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [ButtonModule, CardModule, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home implements OnInit {
  private headerService = inject(HeaderService);

  ngOnInit(): void {
    this.headerService.setTitle('Avalia Senior');
    this.headerService.setShowBackButton(false);
  }
}
