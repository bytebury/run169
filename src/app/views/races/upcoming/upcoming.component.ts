import { Component, OnInit, computed, signal } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { finalize, take } from 'rxjs';
import {
  PaginatedResponse,
  Race,
  RaceService,
} from 'src/app/services/race.service';
import { Town, TownService } from 'src/app/services/town.service';

@Component({
  selector: 'app-upcoming',
  templateUrl: './upcoming.component.html',
  styleUrls: ['./upcoming.component.scss'],
})
export class UpcomingComponent implements OnInit {
  pageSize = 10;
  pageNumber = 1;
  pageIndex = this.pageNumber - 1;
  totalCount = 0;
  now = new Date();
  isLoading = true;
  allRaces = signal<Race[]>([]);
  upcomingRaces = signal<Race[]>([]);
  displayColumns = ['town', 'name', 'distance', 'race-fee', 'start-time'];

  filterForm = new FormGroup({
    town: new FormControl<Town | string>(''),
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
      .search({
        after: new Date().toISOString().slice(0, 10),
      })
      .pipe(
        take(1),
        finalize(() => (this.isLoading = false))
      )
      .subscribe({
        next: (response: PaginatedResponse<Race>) => {
          this.allRaces.set(response.results);
          this.upcomingRaces.set(response.results);
          this.totalCount = response.total_count;
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  handlePageEvent($event: any): void {
    this.pageSize = $event.pageSize;
    this.pageNumber = $event.pageIndex + 1;

    this.updateTableData();
  }

  updateTableData(): void {
    let startDate =
      this.campaignOne.get('start')?.value ??
      new Date().toISOString().slice(0, 10);
    let endDate = this.campaignOne.get('end')?.value ?? '';

    if (startDate && endDate) {
      startDate = new Date(startDate).toISOString().slice(0, 10);
      endDate = new Date(endDate).toISOString().slice(0, 10);
    }

    this.raceService
      .search({
        townName: (this.filterForm.get('town')?.value as Town)!.name ?? '',
        before: endDate,
        after: startDate,
        page: this.pageNumber,
        pageSize: this.pageSize,
      })
      .pipe(take(1))
      .subscribe({
        next: (response: PaginatedResponse<Race>) => {
          this.upcomingRaces.set(response.results);
          this.totalCount = response.total_count;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  clearFilter(): void {
    this.filterForm.get('town')?.setValue('');
    this.campaignOne.reset();
    this.updateTableData();
  }
}
