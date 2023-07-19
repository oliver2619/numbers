import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'n-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  @HostListener('window:contextmenu', ['$event'])
  contextMenu(ev: MouseEvent) {
    ev.preventDefault();
  }
}
