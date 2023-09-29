import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appTimeFormat]',
})
export class TimeFormatDirective {
  time = '';

  constructor(private element: ElementRef) {}

  @HostListener('input', ['$event'])
  onInput(event: any): void {
    this.time = event.target.value;

    if (event.inputType === 'insertFromPaste') {
      this.time = event.target.value.match(/(.{2})/g).join(':');
    }

    if (!event.inputType.includes('delete')) {
      if (this.time.length === 2 || this.time.length === 5) {
        this.time += ':';
      }
    }

    this.element.nativeElement.value = this.time;
  }
}
