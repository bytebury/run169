import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'distance',
  standalone: true,
})
export class DistancePipe implements PipeTransform {
  transform(value: 'km' | 'mi', expanded: 'short' | 'long' = 'short'): string {
    if (value === 'km') {
      return expanded === 'short' ? 'K' : 'Kilometers';
    }
    return expanded === 'short' ? 'M' : 'Miles';
  }
}
