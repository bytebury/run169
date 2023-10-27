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
  now = new Date();
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

  campaignOne = new FormGroup({
    start: new FormControl(),
    end: new FormControl(),
  });

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

  filterDates(): void {
    const start = new Date(this.campaignOne.get('start')?.value).toISOString();
    const end = new Date(this.campaignOne.get('end')?.value).toISOString();

    this.upcomingRaces.update((races) => {
      return races.filter((race) => {
        return race.start_time >= start && race.start_time <= end;
      });
    });
  }

  clearFilter(): void {
    this.filterForm.get('town')?.setValue('');
    this.campaignOne.reset();
    this.upcomingRaces.set(this.allRaces());
  }
}
