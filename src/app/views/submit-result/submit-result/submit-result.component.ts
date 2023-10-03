import { Component, OnInit, computed, signal } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormGroupDirective,
} from '@angular/forms';
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
  filteredRaces = signal<Race[]>([]);
  races = computed(() => this.raceService.races());

  submitRaceForm = new FormGroup({
    race: new FormControl<string | any>('', [Validators.required]),
    bibNumber: new FormControl(''),
    totalTime: new FormControl('', [
      Validators.maxLength(8),
      Validators.minLength(8),
    ]),
  });

  constructor(
    private raceResultService: RaceResultService,
    private raceService: RaceService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.raceService.loadRaces();

    this.submitRaceForm
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
    if (this.submitRaceForm.invalid) {
      return;
    }

    const result: CreateRaceResult = {
      race_id: this.submitRaceForm.get('race')?.value!.id,
      user_id: this.authenticationService.currentUser()?.id ?? 0,
      hours: Number(this.submitRaceForm.get('totalTime')?.value!.slice(0, 2)),
      minutes: Number(this.submitRaceForm.get('totalTime')?.value!.slice(3, 5)),
      seconds: Number(this.submitRaceForm.get('totalTime')?.value!.slice(-2)),
      bib_number: this.submitRaceForm.get('bibNumber')?.value!,
    };

    this.raceResultService
      .create(result)
      .pipe(take(1))
      .subscribe({
        next: (response) => {
          console.log(response);
          this.submitRaceForm.reset();
          directive.resetForm();
        },
        error: (error) => {
          console.error(error);
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
}
