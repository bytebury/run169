import { Component, OnInit, computed, signal } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, map, switchMap, tap } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { RaceResult } from 'src/app/services/race-result.service';
import { Race, RaceService } from 'src/app/services/race.service';
import { Runner } from 'src/app/services/runner.service';

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

  now = new Date().toISOString();
  race = signal<Race | null>(null);
  results = signal<RaceResult[]>([]);
  watchers = signal<{ id: number; user: Runner }[]>([]);
  isRaceOver = computed(() => {
    return (
      this.now.localeCompare(this.race()?.start_time.toString() ?? this.now) >=
      0
    );
  });
  isWatching = computed(() => {
    return (
      this.watchers().findIndex(
        ({ user: { id } }) => id === this.auth.currentUser()?.id
      ) >= 0
    );
  });

  constructor(
    private auth: AuthenticationService,
    private raceService: RaceService,
    private activatedRoute: ActivatedRoute,
    private snackbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((paramMap) => {
      const raceId = paramMap.get('id') ?? '';

      this.raceService
        .find(raceId)
        .pipe(
          tap((race) => {
            this.race.set(race);
          }),
          switchMap((race) => {
            return forkJoin([
              this.raceService.findResultsByRace(race.id),
              this.raceService.findWatchers(race.id),
            ]);
          }),
          map(([results, watchers]) => [this.sortResults(results), watchers])
        )
        .subscribe({
          next: ([results, watchers]) => {
            this.results.set(results);
            this.watchers.set(watchers);
          },
          error: (error) => {
            console.log(error);
          },
        });
    });
  }

  watch(): void {
    this.raceService.watch(this.race()!.id).subscribe({
      next: () => {
        this.findWatchers();
      },
      error: (error) => {
        console.error(error);
      },
    });
    this.snackbar.open('🎉 Added this race to your race calendar', 'Dismiss');
  }

  unwatch(): void {
    this.raceService.removeWatch(this.race()!.id).subscribe({
      next: () => {
        this.findWatchers();
      },
      error: (error) => {
        console.log(error);
      },
    });
    this.snackbar.open('Removed this race from your race calendar', 'Dismiss');
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

  private findWatchers(): any {
    this.raceService.findWatchers(this.race()!.id).subscribe({
      next: (watchers: { id: number; user: Runner }[]) => {
        this.watchers.set(watchers);
      },
      error: (error: Error) => {
        console.error(error);
      },
    });
  }
}
