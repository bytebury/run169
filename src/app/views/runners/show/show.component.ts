import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { filter, mergeMap, tap, toArray } from 'rxjs';
import { RaceResult } from 'src/app/services/race-result.service';
import { Race, RaceService } from 'src/app/services/race.service';
import { Runner, RunnerService } from 'src/app/services/runner.service';

@Component({
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss'],
})
export class ShowComponent implements OnInit {
  runnerInfo: Runner = {} as Runner;
  racesBeingWatched = signal<Race[]>([]);
  raceResults = signal<RaceResult[]>([]);

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
    private raceService: RaceService,
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
          mergeMap(() => this.runner.getWatchList(this.runnerInfo.id)),
          mergeMap((watchlist) => watchlist),
          filter((item) => !!item.race),
          mergeMap((item) => this.raceService.find(item.race!.id.toString())),
          toArray()
        )
        .subscribe({
          next: (races) => {
            this.racesBeingWatched.set(races);
          },
          error: (error) => {
            console.error(error);
          },
        });
    });
  }
}
