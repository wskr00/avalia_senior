import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { HeaderService } from '@/services/header';

@Component({
  selector: 'app-home',
  imports: [],
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
