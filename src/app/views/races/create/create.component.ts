import { Component, OnInit, computed, effect } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormGroupDirective,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, of, startWith, map } from 'rxjs';
import { CreateRace, Race, RaceService } from 'src/app/services/race.service';
import { Town, TownService } from 'src/app/services/town.service';

@Component({
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  towns = computed(() => this.townService.towns());

  form = new FormGroup({
    raceName: new FormControl('', [Validators.required]),
    townName: new FormControl<string | any>('', [
      Validators.required,
      this.townMustExistValidator(),
    ]),
    distanceValue: new FormControl(null, [Validators.required]),
    distanceUnit: new FormControl<'km' | 'mi'>('km', [Validators.required]),
    startTime: new FormControl<Date | string | null>(null, [
      Validators.required,
    ]),
    addressLineOne: new FormControl(''),
    logoUrl: new FormControl(''),
    websiteUrl: new FormControl(''),
    resultsUrl: new FormControl(''),
  });

  filteredOptions: Observable<any[]> = of([]);

  constructor(
    private townService: TownService,
    private raceService: RaceService,
    private router: Router,
    private snackbar: MatSnackBar
  ) {
    effect(() => {
      if (this.towns().length > 0) {
        this.form.get('townName')?.setValue('');
      }
    });
  }

  ngOnInit(): void {
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

  handleSubmit(directive: FormGroupDirective): void {
    if (this.form.valid) {
      const race: CreateRace = {
        name: this.form.get('raceName')?.value!,
        town_id: this.form.get('townName')?.value.id!,
        start_time: new Date(this.form.get('startTime')?.value!),
        distance: this.form.get('distanceValue')?.value!,
        distance_unit: this.form.get('distanceUnit')?.value!,
        address_line_one: this.form.get('addressLineOne')?.value ?? '',
        logo_url: this.form.get('logoUrl')?.value ?? '',
        website_url: this.form.get('websiteUrl')?.value ?? '',
        results_url: this.form.get('resultsUrl')?.value ?? '',
      };

      this.raceService.create(race).subscribe({
        next: (race: Race) => {
          this.form.reset();
          directive.resetForm();
          this.snackbar.open('Successfully created your race', 'Dismiss');
          this.router.navigate(['/races', race.id]);
        },
        error: ({ error }) => {
          this.snackbar.open(error.message, 'Dismiss');
        },
      });
    }
  }

  displayFn(town: Town): string {
    return town?.name ? town.name : '';
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();

    return this.towns().filter((town: Town) =>
      town.name.toLowerCase().includes(filterValue)
    );
  }

  private townMustExistValidator(): ValidatorFn {
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
