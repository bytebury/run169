import { Component, OnInit, computed, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { filter, mergeMap, take, tap, toArray } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { RaceResult } from 'src/app/services/race-result.service';
import { Race } from 'src/app/services/race.service';
import { Runner, RunnerService } from 'src/app/services/runner.service';
import { UpdateAvatarDialog } from './update-avatar-dialog/update-avatar-dialog.component';
import { TownService } from 'src/app/services/town.service';

@Component({
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss'],
})
export class ShowComponent implements OnInit {
  isLoading = true;
  runnerInfo: Runner = {} as Runner;
  racesBeingWatched = signal<(Race & { is_going: boolean })[]>([]);
  raceResults = signal<RaceResult[]>([]);
  completedTowns = signal<{ town_name: string; count: number }[]>([]);
  isMyProfile = false;
  completedTownsData = computed(() => {
    const numCompletedTowns = this.completedTowns().length;
    const numRemainingTowns = this.towns.towns().length - numCompletedTowns;
    const percentComplete = parseFloat(
      ((numCompletedTowns / numRemainingTowns) * 100).toString()
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
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.towns.loadTowns();
    this.activatedRoute.paramMap.subscribe((paramMap) => {
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
            this.completedTowns.set(results);
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
}
