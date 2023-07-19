import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { TextService } from './text.service';

@Directive({
  selector: '[nText]'
})
export class TextDirective implements OnInit {

  @Input("nText")
  text: string | undefined;

  constructor(private readonly textService: TextService, private readonly elementRef: ElementRef<HTMLElement>) { }

  ngOnInit(): void {
    if (this.text !== undefined) {
      this.elementRef.nativeElement.innerText = this.textService.get(this.text);
    }
  }
}
