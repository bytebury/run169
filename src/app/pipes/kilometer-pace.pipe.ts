import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'kilometerPace',
  standalone: true,
})
export class KilometerPacePipe implements PipeTransform {
  transform(totalSeconds: number, distance: number, unit: 'km' | 'mi'): string {
    if (totalSeconds <= 0) {
      return '--';
    }

    if (unit === 'mi') {
      distance = this.convertMilesToKilometers(distance);
    }

    const minutesPerKm = totalSeconds / distance / 60;
    const minutes = Math.floor(minutesPerKm);
    const seconds = Math.floor((minutesPerKm % minutes) * 60);

    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  convertMilesToKilometers(miles: number): number {
    return miles * 1.609;
  }
}
