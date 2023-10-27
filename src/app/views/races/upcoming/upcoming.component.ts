import { Component, OnInit, computed, signal } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { finalize, take } from 'rxjs';
import { Race, RaceService } from 'src/app/services/race.service';
import { Town, TownService } from 'src/app/services/town.service';

@Component({
  selector: 'app-upcoming',
  templateUrl: './upcoming.component.html',
  styleUrls: ['./upcoming.component.scss'],
})
export class UpcomingComponent implements OnInit {
  isLoading = true;
  allRaces = signal<Race[]>([]);
  upcomingRaces = signal<Race[]>([]);
  displayColumns = ['town', 'name', 'distance', 'race-fee', 'start-time'];
  filterForm = new FormGroup({
    town: new FormControl(''),
  });
  allAvailableTowns = computed(() =>
    this.towns.towns().filter((town) => {
      return this.allRaces()
        .map((race) => race.town.name)
        .includes(town.name);
    })
  );

  constructor(private towns: TownService, private raceService: RaceService) {}

  ngOnInit(): void {
    this.towns.loadTowns();
    this.raceService
      .findUpcomingRaces()
      .pipe(
        take(1),
        finalize(() => (this.isLoading = false))
      )
      .subscribe({
        next: (races) => {
          this.allRaces.set(races);
          this.upcomingRaces.set(races);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  filterTowns(town: Town): void {
    this.raceService
      .findUpcomingRaces(`town=${town.name}`)
      .pipe(take(1))
      .subscribe({
        next: (races: Race[]) => {
          this.upcomingRaces.set(races);
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  clearFilter(): void {
    this.filterForm.get('town')?.setValue('');
    this.upcomingRaces.set(this.allRaces());
  }
}
