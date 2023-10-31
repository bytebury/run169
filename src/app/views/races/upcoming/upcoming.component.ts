import { Component, OnInit, computed, signal } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { take, tap } from 'rxjs';
import {
  PaginatedResponse,
  Race,
  RaceService,
} from 'src/app/services/race.service';
import { Town, TownService } from 'src/app/services/town.service';
import { getYearMonthDay } from 'src/app/utils/date';

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
    this.loadAllRaces();
    this.updateTableData();
  }

  loadAllRaces(): void {
    this.raceService
      .search({
        after: getYearMonthDay(new Date()),
        pageSize: 100_000,
      })
      .pipe(
        take(1),
        tap(() => {
          this.isLoading = true;
        })
      )
      .subscribe((response) => {
        this.allRaces.set(response.results);
        this.isLoading = false;
      });
  }

  handlePageEvent($event: any): void {
    this.pageSize = $event.pageSize;
    this.pageNumber = $event.pageIndex + 1;

    this.updateTableData();
  }

  updateTableData(): void {
    let startDate =
      this.campaignOne.get('start')?.value ?? getYearMonthDay(new Date());
    let endDate = this.campaignOne.get('end')?.value ?? '';

    if (startDate && endDate) {
      startDate = getYearMonthDay(new Date(startDate));
      endDate = getYearMonthDay(new Date(endDate));
    }

    this.raceService
      .search({
        townName: (this.filterForm.get('town')?.value as Town)!.name ?? '',
        before: endDate,
        after: startDate,
        page: this.pageNumber,
        pageSize: this.pageSize,
      })
      .pipe(
        take(1),
        tap(() => {
          this.isLoading = true;
        })
      )
      .subscribe({
        next: (response: PaginatedResponse<Race>) => {
          this.upcomingRaces.set(response.results);
          this.totalCount = response.total_count;
          this.isLoading = false;
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
