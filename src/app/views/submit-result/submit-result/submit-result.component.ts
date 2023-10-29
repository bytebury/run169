import { Component, OnInit, effect, signal } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormGroupDirective,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime, distinctUntilChanged, map, startWith, take } from 'rxjs';
import { AuthenticationService } from 'src/app/services/authentication.service';
import {
  CreateRaceResult,
  RaceResultService,
} from 'src/app/services/race-result.service';
import { Race, RaceService } from 'src/app/services/race.service';

@Component({
  templateUrl: './submit-result.component.html',
  styleUrls: ['./submit-result.component.scss'],
})
export class SubmitResultComponent implements OnInit {
  isLoading = true;
  races = signal<Race[]>([]);

  resultForm = new FormGroup({
    race: new FormControl<string | any>('', [
      Validators.required,
      this.raceMustExistValidator(),
    ]),
    bibNumber: new FormControl(''),
    totalTime: new FormControl('', [
      Validators.maxLength(8),
      Validators.minLength(8),
    ]),
  });

  constructor(
    private raceResultService: RaceResultService,
    private raceService: RaceService,
    private authenticationService: AuthenticationService,
    private snackBar: MatSnackBar
  ) {
    effect(() => {
      if (this.races().length > 0) {
        this.isLoading = false;
      }
    });
  }

  ngOnInit(): void {
    this.loadPreviousRaces();
    this.resultForm
      .get('race')
      ?.valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        distinctUntilChanged(),
        map((value) => {
          const name = typeof value === 'string' ? value : value?.name;

          if (name) {
            return this._filterRaces(name as string);
          }

          return this.races();
        })
      )
      .subscribe();
  }

  loadPreviousRaces(): void {
    this.raceService
      .search({
        before: new Date().toISOString().slice(0, 10),
        order: 'DESC',
      })
      .pipe(take(1))
      .subscribe({
        next: (response) => this.races.set(response.results),
        error: (error) => {
          console.log(error);
        },
      });
  }

  submitRace(directive: FormGroupDirective): void {
    if (this.resultForm.invalid) {
      return;
    }

    const result: CreateRaceResult = {
      race_id: this.resultForm.get('race')?.value!.id,
      user_id: this.authenticationService.currentUser()?.id ?? 0,
      time_in_seconds: this.getTimeInSeconds(),
      bib_number: this.resultForm.get('bibNumber')?.value!,
    };

    this.raceResultService
      .create(result)
      .pipe(take(1))
      .subscribe({
        next: (_response) => {
          this.resultForm.reset();
          directive.resetForm();
          this.snackBar.open(
            'Successfully submitted your race to Run169Towns',
            'Dismiss'
          );
        },
        error: ({ error }) => {
          this.snackBar.open(error.message, 'Dismiss');
        },
      });
  }

  raceDisplayFn(race: Race): string {
    return race?.name ? race.name : '';
  }

  private _filterRaces(name: string) {
    this.raceService
      .search({
        before: new Date().toISOString().slice(0, 10),
        name,
        order: 'DESC',
      })
      .pipe(take(1))
      .subscribe((response) => {
        this.races.set(response.results);
      });
  }

  private raceMustExistValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const selectedValue = control.value;
      if (selectedValue) {
        const foundOption = this.races().find((race) => race === selectedValue);
        if (!foundOption) {
          return { townMustExist: true }; // Validation fails if the option is not found
        }
      }
      return null; // Validation passes
    };
  }

  private getTimeInSeconds(): number {
    const hours = Number(this.resultForm.get('totalTime')?.value?.slice(0, 2));
    const minutes = Number(
      this.resultForm.get('totalTime')?.value?.slice(3, 5)
    );
    const seconds = Number(this.resultForm.get('totalTime')?.value?.slice(-2));

    return hours * 3600 + minutes * 60 + seconds;
  }
}
