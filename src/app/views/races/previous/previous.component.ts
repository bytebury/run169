import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import { finalize, take } from 'rxjs';
import { Race, RaceService } from 'src/app/services/race.service';

@Component({
  selector: 'app-previous',
  templateUrl: './previous.component.html',
  styleUrls: ['./previous.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviousComponent implements OnInit {
  isLoading = signal(true);
  previousRaces = signal<Race[]>([]);
  displayColumns = ['number-of-runners', 'name', 'distance', 'start-time'];

  constructor(private race: RaceService) {}

  ngOnInit(): void {
    this.race
      .findPreviousRaces()
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading.set(false);
        })
      )
      .subscribe({
        next: (races: Race[]) => {
          this.previousRaces.set(races);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }
}
