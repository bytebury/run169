import { Component, OnInit, computed, effect } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, of, startWith, map, tap } from 'rxjs';
import { RunnerService } from 'src/app/services/runner.service';
import { Town, TownService } from 'src/app/services/town.service';
import { environment } from 'src/environments/environment';

@Component({
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  allTowns = computed(() => this.townService.towns());
  towns = computed(() => {
    const towns = this.townService.towns();
    return [...towns, { id: 0, name: 'Out of State' }];
  });

  registerForm = new FormGroup({
    hometown: new FormControl<string | any>('', [
      Validators.required,
      this.townMustExistValidator(),
    ]),
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.email, Validators.required]),
    sex: new FormControl<'male' | 'female' | ''>('', [Validators.required]),
    avatarUrl: new FormControl(
      'https://www.shareicon.net/data/512x512/2017/02/15/878685_user_512x512.png',
      [Validators.required]
    ),
    runnerId: new FormControl('', [
      Validators.required,
      Validators.pattern(/\d+/),
    ]),
    password: new FormControl('', [Validators.required]),
  });

  completedTownsForm: FormGroup = new FormGroup({});

  filteredOptions: Observable<{ name: string; id: number }[]> = of([]);

  hide = true;

  constructor(
    private runner: RunnerService,
    private townService: TownService,
    private snackbar: MatSnackBar,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    effect(() => {
      if (this.towns().length > 0) {
        this.registerForm.get('hometown')!.setValue('');
      }
    });

    effect(() => {
      for (let i = 1; i < 170; i++) {
        const formControls = {} as any;

        for (const town of this.allTowns()) {
          formControls[town.id] = this.formBuilder.control(false);
        }

        this.completedTownsForm = this.formBuilder.group(formControls);
      }
    });
  }

  ngOnInit(): void {
    this.townService.loadTowns();
    this.filteredOptions = this.registerForm.get('hometown')!.valueChanges.pipe(
      startWith(''),
      map((value) => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filter(name as string) : this.towns().slice();
      })
    );
  }

  createAccount(): void {
    this.runner
      .create({
        first_name: this.registerForm.get('firstName')!.value!,
        last_name: this.registerForm.get('lastName')!.value!,
        email: this.registerForm.get('email')!.value!,
        sex: this.registerForm.get('sex')!.value! as 'male' | 'female',
        avatar_url: this.registerForm.get('avatarUrl')!.value!,
        runner_id: this.registerForm.get('runnerId')!.value!.toString(),
        hometown: this.registerForm.get('hometown')!.value!.name,
        password_digest: this.registerForm.get('password')!.value!,
      })
      .pipe(tap((runner) => this.submitPreviousTowns(runner.id)))
      .subscribe({
        next: () => {
          this.snackbar.open(
            '🚀 Successfully created your account, you can now log in'
          );
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.log(error);
          this.snackbar.open(error.error.message, 'Dismiss');
        },
      });
  }

  displayFn(town: Town): string {
    return town?.name ? town.name : '';
  }

  private submitPreviousTowns(userId: string | number): void {
    const selectedTowns = Object.keys(this.completedTownsForm.value).filter(
      (town) => this.completedTownsForm.value[town]
    );

    const requests = selectedTowns.map((townId) =>
      fetch(`${environment.backendUrl}/results/phantom`, {
        method: 'POST',
        body: JSON.stringify({
          user_id: Number(userId),
          town_id: Number(townId),
        }),
      })
    );

    Promise.all(requests);
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
