import { Component, OnInit, signal } from '@angular/core';
import { take } from 'rxjs';
import { Race, RaceService } from 'src/app/services/race.service';

@Component({
  templateUrl: './upcoming.component.html',
  styleUrls: ['./upcoming.component.scss'],
})
export class UpcomingComponent implements OnInit {
  upcomingRaces = signal<Race[]>([]);
  displayColumns = ['town', 'name', 'distance', 'start-time'];

  constructor(private raceService: RaceService) {}

  ngOnInit(): void {
    this.raceService
      .findUpcomingRaces()
      .pipe(take(1))
      .subscribe({
        next: (races) => {
          this.upcomingRaces.set(races);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }
}
