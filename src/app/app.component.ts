import { Component, computed, signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormGroupDirective,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Observable, startWith, map, of, take } from 'rxjs';
import { CreateRace, Race, RaceService } from './services/race.service';
import { Town, TownService } from './services/town.service';
import {
  CreateRaceResult,
  RaceResultService,
} from './services/race-result.service';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  towns = computed(() => this.townService.towns());
  races = computed(() => this.raceService.races());
  isLoggedIn = computed(() => this.authenticationService.isLoggedIn());
  currentUser = computed(() => this.authenticationService.currentUser());
  authErrorMessage = computed(() => this.authenticationService.errorMessage());

  submitRaceForm = new FormGroup({
    race: new FormControl<string | any>('', [Validators.required]),
    bibNumber: new FormControl(''),
    totalTime: new FormControl('', [
      Validators.maxLength(8),
      Validators.minLength(8),
    ]),
  });

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  form = new FormGroup({
    raceName: new FormControl('', [Validators.required]),
    townName: new FormControl<string | any>('', [
      Validators.required,
      this.townMustExistValidator(),
    ]),
    distanceValue: new FormControl(null, [Validators.required]),
    kilometers: new FormControl(true),
    startTime: new FormControl(
      new Date().toISOString().slice(0, 10) + 'T08:30',
      [Validators.required]
    ),
    addressLineOne: new FormControl(''),
    websiteUrl: new FormControl(''),
    resultsUrl: new FormControl(''),
  });

  filteredOptions: Observable<any[]> = of([]);
  filteredRaces = signal<Race[]>([]);

  constructor(
    private townService: TownService,
    private raceService: RaceService,
    private raceResultService: RaceResultService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.townService.loadTowns();
    this.raceService.loadRaces();

    this.filteredOptions =
      this.form.get('townName')?.valueChanges.pipe(
        startWith(''),
        map((value) => {
          const name = typeof value === 'string' ? value : value?.name;
          return name ? this._filter(name as string) : this.towns().slice();
        })
      ) ?? of([]);

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

  displayFn(town: Town): string {
    return town?.name ? town.name : '';
  }

  raceDisplayFn(race: Race): string {
    return race?.name ? race.name : '';
  }

  handleSubmit(directive: FormGroupDirective): void {
    if (this.form.valid) {
      const race: CreateRace = {
        name: this.form.get('raceName')?.value!,
        town_id: this.form.get('townName')?.value.id!,
        start_date: this.form.get('startTime')?.value!,
        distance: this.form.get('distanceValue')?.value!,
        distance_unit: this.form.get('kilometers')?.value!
          ? 'kilometer'
          : 'mile',
        address_line_one: this.form.get('addressLineOne')?.value ?? '',
        website_url: this.form.get('websiteUrl')?.value ?? '',
        results_url: this.form.get('resultsUrl')?.value ?? '',
      };

      this.raceService.create(race).subscribe({
        next: (_response) => {
          this.form.reset();
          directive.resetForm();
        },
        error: (error) => {
          console.error(error);
        },
      });
    }
  }

  login(): void {
    const email = this.loginForm.get('email')?.value ?? '';
    const password = this.loginForm.get('password')?.value ?? '';

    this.authenticationService.login(email, password);
  }

  logout(): void {
    this.authenticationService.logout();
  }

  submitRace(directive: FormGroupDirective): void {
    if (this.submitRaceForm.invalid) {
      return;
    }

    const result: CreateRaceResult = {
      race_id: this.submitRaceForm.get('race')?.value!.id,
      user_id: 3,
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

  private _filterRaces(name: string): any[] {
    const filterValue = name.toLowerCase();
    return this.races().filter((race: Race) => {
      return race.name.toLowerCase().includes(filterValue);
    });
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();

    return this.towns().filter((town: Town) =>
      town.name.toLowerCase().includes(filterValue)
    );
  }

  townMustExistValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const selectedValue = control.value;
      if (selectedValue) {
        const foundOption = this.towns().find((town) => town === selectedValue);
        if (!foundOption) {
          return { townMustExist: true }; // Validation fails if the option is not found
        }
      }
      return null; // Validation passes
    };
  }
}
