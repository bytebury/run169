import { Component, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { filter, mergeMap, take, tap, toArray } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { RaceResult } from 'src/app/services/race-result.service';
import { Race } from 'src/app/services/race.service';
import { Runner, RunnerService } from 'src/app/services/runner.service';
import { UpdateAvatarDialog } from './update-avatar-dialog/update-avatar-dialog.component';

@Component({
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.scss'],
})
export class ShowComponent implements OnInit {
  runnerInfo: Runner = {} as Runner;
  racesBeingWatched = signal<(Race & { is_going: boolean })[]>([]);
  raceResults = signal<RaceResult[]>([]);
  completedTowns = signal<{ town_name: string; count: number }[]>([]);
  isMyProfile = false;

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
    private auth: AuthenticationService,
    private runner: RunnerService,
    private activatedRoute: ActivatedRoute,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
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
          },
          error: (error) => {
            console.error(error);
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
