import { Component, OnInit, computed, effect } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, of, startWith, map } from 'rxjs';
import { RunnerService } from 'src/app/services/runner.service';
import { Town, TownService } from 'src/app/services/town.service';

@Component({
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  towns = computed(() => this.townService.towns());

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
      'https://img1.wsimg.com/isteam/ip/8523ecca-e58e-40b8-8e18-385a14f302eb/favicon/62c34b6b-68b2-4c53-9b6f-2ee4c0854556.PNG/:/rs=w:320,h:320,m',
      [Validators.required]
    ),
    runnerId: new FormControl('', [
      Validators.required,
      Validators.pattern(/\d+/),
    ]),

    password: new FormControl('', [Validators.required]),
  });

  filteredOptions: Observable<{ name: string; id: number }[]> = of([]);

  hide = true;

  constructor(
    private runner: RunnerService,
    private townService: TownService,
    private snackbar: MatSnackBar,
    private router: Router
  ) {
    effect(() => {
      if (this.towns().length > 0) {
        this.registerForm.get('hometown')!.setValue('');
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
        town_id: this.registerForm.get('hometown')!.value!.id,
        password_digest: this.registerForm.get('password')!.value!,
      })
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
