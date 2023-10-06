import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, mergeMap } from 'rxjs';
import { RaceResult } from 'src/app/services/race-result.service';
import { Race, RaceService } from 'src/app/services/race.service';

@Component({
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss'],
})
export class ShowComponent implements OnInit {
  readonly displayColumns = [
    'place',
    'total-time',
    'runner',
    'sex',
    'mile-pace',
    'kilometer-pace',
  ];

  race: Race | null = null;
  results = signal<RaceResult[]>([]);

  constructor(
    private raceService: RaceService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      const raceId = paramMap.get('id') ?? '';

      this.raceService
        .find(raceId)
        .pipe(
          mergeMap((race) => {
            this.race = race;
            return this.raceService.findResultsByRace(race.id);
          })
        )
        .pipe(map((results) => this.sortResults(results)))
        .subscribe({
          next: (results) => {
            this.results.set(results);
          },
          error: (error) => {
            console.log(error);
          },
        });
    });
  }

  watch(): void {
    if (this.race) {
      this.raceService.removeWatch(this.race.id).subscribe({
        next: () => {
          // no-op
        },
        error: (error) => {
          console.error(error);
        },
      });
    }
  }

  sortResults(results: RaceResult[]): RaceResult[] {
    const resultsWithTimes = results.filter(
      (result) => result.hours || result.minutes || result.seconds
    );
    const resultsWithNoTimes = results.filter(
      (result) => !result.hours && !result.minutes && !result.seconds
    );
    return [...resultsWithTimes, ...resultsWithNoTimes];
  }
}
