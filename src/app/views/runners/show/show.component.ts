import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, mergeMap, tap, toArray } from 'rxjs';
import { RaceResult } from 'src/app/services/race-result.service';
import { Race } from 'src/app/services/race.service';
import { Runner, RunnerService } from 'src/app/services/runner.service';

@Component({
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss'],
})
export class ShowComponent implements OnInit {
  runnerInfo: Runner = {} as Runner;
  racesBeingWatched = signal<Race[]>([]);
  raceResults = signal<RaceResult[]>([]);
  completedTowns = signal<{ town_name: string; count: number }[]>([]);

  readonly displayColumns = [
    'name',
    'bib',
    'total-time',
    'distance',
    'mile-pace',
    'kilometer-pace',
    'start-time',
  ];

  constructor(
    private runner: RunnerService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      const runnerId = paramMap.get('runner_id') ?? '';

      this.runner
        .find(runnerId)
        .pipe(
          tap((runner) => {
            this.runnerInfo = runner;
          }),
          mergeMap(() => this.runner.getResults(this.runnerInfo.id)),
          tap((results) => this.raceResults.set(results)),
          mergeMap(() => this.runner.getCompletedTowns(this.runnerInfo.id)),
          tap((results) => {
            this.completedTowns.set(results);
          }),
          mergeMap(() => this.runner.getWatchList(this.runnerInfo.id)),
          mergeMap((watchlist) => watchlist),
          filter((watchList) => !!watchList.race),
          toArray()
        )
        .subscribe({
          next: (watchlist) => {
            this.racesBeingWatched.set(watchlist.map(({ race }) => race!));
          },
          error: (error) => {
            console.error(error);
          },
        });
    });
  }
}
