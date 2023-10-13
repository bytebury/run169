import { Component, OnInit, signal } from '@angular/core';
import { finalize, take } from 'rxjs';
import { Race, RaceService } from 'src/app/services/race.service';

@Component({
  templateUrl: './upcoming.component.html',
  styleUrls: ['./upcoming.component.scss'],
})
export class UpcomingComponent implements OnInit {
  isLoading = true;
  upcomingRaces = signal<Race[]>([]);
  displayColumns = ['town', 'name', 'distance', 'start-time'];

  constructor(private raceService: RaceService) {}

  ngOnInit(): void {
    this.raceService
      .findUpcomingRaces()
      .pipe(
        take(1),
        finalize(() => (this.isLoading = false))
      )
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
