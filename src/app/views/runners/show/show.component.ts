import { Component, computed, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, mergeMap, take, tap, toArray } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { RaceResult } from 'src/app/services/race-result.service';
import { Race } from 'src/app/services/race.service';
import { Runner, RunnerService } from 'src/app/services/runner.service';
import { UpdateAvatarDialog } from './update-avatar-dialog/update-avatar-dialog.component';
import { TownService } from 'src/app/services/town.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CompletedTownsService } from './completed-towns.service';

@Component({
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss'],
})
export class ShowComponent {
  readonly tabs = ['Overview', 'Results', 'Calendar', 'Towns'];
  activeTab = 0;

  isLoading = true;
  runnerInfo: Runner = {} as Runner;
  racesBeingWatched = signal<(Race & { is_going: boolean })[]>([]);
  raceResults = signal<RaceResult[]>([]);
  isMyProfile = false;
  completedTownsSignal = signal<{ town_name: string; count: number }[]>([]);
  completedTownsData = computed(() => {
    const numberOfTowns = this.towns.towns().length;
    const numCompletedTowns = this.completedTownsSignal().length;
    const numRemainingTowns = numberOfTowns - numCompletedTowns;
    const percentComplete = parseFloat(
      ((numCompletedTowns / numberOfTowns) * 100).toString()
    ).toFixed();
    const percentRemaining = 100 - parseInt(percentComplete);

    return {
      labels: [
        `Completed ${percentComplete}%`,
        `Remaining ${percentRemaining}%`,
      ],
      datasets: [
        {
          data: [numCompletedTowns, numRemainingTowns],
          backgroundColor: ['#637ab0', '#aebfe6'],
        },
      ],
    };
  });

  readonly displayColumns = [
    'name',
    'total-time',
    'mile-pace',
    'kilometer-pace',
    'start-time',
  ];

  readonly watchListDisplayColumns = ['going', 'name'];

  constructor(
    private auth: AuthenticationService,
    private runner: RunnerService,
    private activatedRoute: ActivatedRoute,
    private towns: TownService,
    private router: Router,
    public dialog: MatDialog,
    private completedTowns: CompletedTownsService
  ) {
    this.towns.loadTowns();
    this.activatedRoute.queryParamMap
      .pipe(takeUntilDestroyed())
      .subscribe((paramMap) => {
        const tab = paramMap.get('tab') as string | null;

        this.activeTab = this.tabs.findIndex((t) => t === tab ?? 'Overview');

        if (this.activeTab < 0) {
          this.activeTab = 0;
        }
      });

    this.activatedRoute.paramMap
      .pipe(takeUntilDestroyed())
      .subscribe((paramMap) => {
        const runnerId = paramMap.get('runner_id') ?? '';

        this.runner
          .find(runnerId)
          .pipe(
            tap((runner) => {
              this.runnerInfo = runner;
              this.isMyProfile = this.auth.currentUser()?.id === runner.id;
            }),
            mergeMap(() => this.runner.getResults(this.runnerInfo.id)),
            tap((results) => this.raceResults.set(results)),
            mergeMap(() => this.runner.getCompletedTowns(this.runnerInfo.id)),
            tap((results) => {
              this.completedTowns.setCompletedTowns(results);
              this.completedTownsSignal.set(results);
            }),
            mergeMap(() => this.runner.getWatchList(this.runnerInfo.id)),
            mergeMap((watchlist) => watchlist),
            filter((watchList) => !!watchList.race),
            toArray()
          )
          .subscribe({
            next: (watchlist) => {
              this.racesBeingWatched.set(
                watchlist.map(
                  ({ race, is_going }) => ({ ...race, is_going } as any)
                )
              );
              this.isLoading = false;
            },
            error: (error) => {
              console.error(error);
              this.isLoading = false;
            },
          });
      });
  }

  openUpdateAvatarDialog(): void {
    this.dialog
      .open(UpdateAvatarDialog, {
        data: {
          avatar_url: this.runnerInfo.avatar_url,
        },
      })
      .afterClosed()
      .pipe(take(1))
      .subscribe((avatar_url: string | undefined) => {
        if (avatar_url) {
          this.runner.update({ avatar_url }).subscribe({
            next: (user: Runner) => {
              const currentUserData = this.auth.currentUser()!;
              this.auth.currentUser.set({ ...currentUserData, avatar_url });
              this.runnerInfo = user;
            },
            error: (error) => {
              console.error(error);
            },
          });
        }
      });
  }

  setTab(index: number): void {
    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { tab: this.tabs[index] },
      queryParamsHandling: 'merge',
    });
  }
}
