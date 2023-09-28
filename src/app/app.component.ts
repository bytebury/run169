import { Component, computed } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormGroupDirective,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Observable, startWith, map, of } from 'rxjs';
import { CreateRace, RaceService } from './services/race.service';
import { Town, TownService } from './services/town.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  towns = computed(() => this.townService.towns());

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

  constructor(
    private townService: TownService,
    private raceService: RaceService
  ) {}

  ngOnInit() {
    this.townService.loadTowns();

    this.filteredOptions =
      this.form.get('townName')?.valueChanges.pipe(
        startWith(''),
        map((value) => {
          const name = typeof value === 'string' ? value : value?.name;
          return name ? this._filter(name as string) : this.towns().slice();
        })
      ) ?? of([]);
  }

  displayFn(town: Town): string {
    return town?.name ? town.name : '';
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
