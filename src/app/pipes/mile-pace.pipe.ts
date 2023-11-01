import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'milePace',
  standalone: true,
})
export class MilePacePipe implements PipeTransform {
  transform(totalSeconds: number, distance: number, unit: 'km' | 'mi'): string {
    if (totalSeconds <= 0) {
      return '--';
    }

    if (unit === 'km') {
      distance = this.convertKilometersToMiles(distance);
    }

    debugger;

    const minutesPerMile = totalSeconds / distance / 60;
    const minutes = Math.floor(minutesPerMile);
    const seconds = Math.floor((minutesPerMile % minutes) * 60);

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  convertKilometersToMiles(kilometers: number): number {
    return kilometers / 1.609;
  }
}
