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

    const totalMinutes = Math.floor(totalTimeInSeconds / 60);
    const hours = Math.floor(totalMinutes / 60) || 1;
    const minutes = totalMinutes % 60;
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
