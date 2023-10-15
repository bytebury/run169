import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'raceTime',
  standalone: true,
})
export class RaceTimePipe implements PipeTransform {
  transform(totalTimeInSeconds: number): string {
    if (totalTimeInSeconds === 0) {
      return '--';
    }

    const hours = Math.floor(totalTimeInSeconds / 3600) || 1;
    const minutes = Math.floor(totalTimeInSeconds / hours / 60);
    const seconds = totalTimeInSeconds % 60;

    const times = [minutes, seconds];

    if (totalTimeInSeconds >= 3600) {
      times.unshift(hours);
    }

    return times
      .map((t: number): string => String(t).padStart(2, '0'))
      .join(':');
  }
}
