import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
} from '@angular/core';
import { finalize, take } from 'rxjs';
import {
  PaginatedResponse,
  Race,
  RaceService,
} from 'src/app/services/race.service';
import { getYearMonthDay } from 'src/app/utils/date';

@Component({
  selector: 'app-previous',
  templateUrl: './previous.component.html',
  styleUrls: ['./previous.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PreviousComponent implements OnInit {
  isLoading = signal(true);
  previousRaces = signal<Race[]>([]);
  pageSize = 10;
  pageNumber = 1;
  pageIndex = this.pageNumber - 1;
  totalCount = 0;
  displayColumns = ['name', 'start-time'];

  constructor(private race: RaceService) {}

  ngOnInit(): void {
    this.updateTableData();
  }

  updateTableData(): void {
    this.race
      .search({
        before: getYearMonthDay(new Date()),
        page: this.pageNumber,
        pageSize: this.pageSize,
        order: 'DESC',
      })
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading.set(false);
        })
      )
      .subscribe({
        next: (response: PaginatedResponse<Race>) => {
          this.previousRaces.set(response.results);
          this.totalCount = response.total_count;
        },
        error: (error) => {
          console.log(error);
        },
      });
  }

  handlePageEvent($event: any): void {
    this.pageSize = $event.pageSize;
    this.pageNumber = $event.pageIndex + 1;

    this.updateTableData();
  }
}
