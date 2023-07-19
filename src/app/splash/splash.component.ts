import { ChangeDetectionStrategy, Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'n-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SplashComponent {

  constructor(private readonly router: Router) {}

  @HostListener('click')
  onClick() {
    this.router.navigateByUrl('/menu');
  }
}
