import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, mergeMap, toArray } from 'rxjs';
import { Race, RaceService } from 'src/app/services/race.service';
import { RunnerInfo, RunnerService } from 'src/app/services/runner.service';

@Component({
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss'],
})
export class ShowComponent implements OnInit {
  runnerInfo: RunnerInfo = {} as RunnerInfo;
  racesBeingWatched = signal<Race[]>([]);

  readonly displayColumns = [
    'name',
    'bib',
    'total-time',
    'distance',
    'mile-pace',
    'kilometer-pace',
    'date-only',
  ];

  constructor(
    private runner: RunnerService,
    private raceService: RaceService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      const runnerId = paramMap.get('runner_id') ?? '';

      this.runner.find(runnerId).subscribe({
        next: (runner) => {
          this.runnerInfo = runner;
        },
        error: (error) => {
          console.error(error);
        },
      });

      this.runner
        .getWatchList(runnerId)
        .pipe(
          mergeMap((watchList) => watchList),
          filter((item) => !!item.race_id),
          mergeMap((item) => this.raceService.find(item.race_id!.toString())),
          toArray()
        )
        .subscribe({
          next: (races) => {
            this.racesBeingWatched.set(races);
          },
          error: (error) => {
            console.log(error);
          },
        });
    });
  }
}
