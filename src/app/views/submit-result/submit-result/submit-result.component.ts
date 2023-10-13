import { Component, OnInit, computed, effect, signal } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormGroupDirective,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, startWith, take } from 'rxjs';
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
  filteredRaces = signal<Race[]>([]);
  races = computed(() => this.raceService.races());

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
    effect(
      () => {
        if (this.races().length > 0) {
          this.resultForm.get('race')?.setValue('');
          this.isLoading = false;
        }
      },
      { allowSignalWrites: true }
    );
  }

  ngOnInit(): void {
    this.raceService.loadPreviousRaces();

    this.resultForm
      .get('race')
      ?.valueChanges.pipe(
        startWith(''),
        map((value) => {
          const name = typeof value === 'string' ? value : value?.name;
          return name ? this._filterRaces(name as string) : this.races();
        })
      )
      .subscribe({
        next: (value) => {
          this.filteredRaces.set(value);
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
      hours: Number(this.resultForm.get('totalTime')?.value?.slice(0, 2)),
      minutes: Number(this.resultForm.get('totalTime')?.value?.slice(3, 5)),
      seconds: Number(this.resultForm.get('totalTime')?.value?.slice(-2)),
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

  private _filterRaces(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.races().filter((race: Race) => {
      return race.name.toLowerCase().includes(filterValue);
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
}
