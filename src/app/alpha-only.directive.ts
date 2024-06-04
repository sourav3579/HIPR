import { Directive, HostListener,ElementRef } from '@angular/core';

@Directive({
  selector: '[appAlphaOnly]'
})
export class AlphaOnlyDirective {

  constructor(private el: ElementRef<HTMLInputElement>) { }
  @HostListener('input', ['$event.target.value'])
  onInput(value: string) {
    const sanitizedValue = value.replace(/[^a-zA-Z\s]+/g, '');
    if (sanitizedValue !== value) {
      this.el.nativeElement.value = sanitizedValue;
      this.el.nativeElement.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }

}
