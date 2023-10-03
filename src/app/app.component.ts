import { Component, computed, effect } from '@angular/core';
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
import { AuthenticationService } from './services/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isLoggedIn = computed(() => this.authenticationService.isLoggedIn());
  authErrorMessage = computed(() => this.authenticationService.errorMessage());

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private townService: TownService,
    private authenticationService: AuthenticationService,
    private snackbar: MatSnackBar
  ) {
    effect(() => {
      if (this.authErrorMessage()) {
        this.snackbar
          .open(this.authErrorMessage(), 'Dismiss', {
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 3_000,
          })
          .afterDismissed()
          .subscribe({
            next: () => {
              this.authenticationService.errorMessage.set('');
            },
          });
      }
    });
  }

  login(): void {
    const email = this.loginForm.get('email')?.value ?? '';
    const password = this.loginForm.get('password')?.value ?? '';

    this.authenticationService.login(email, password);
  }

  logout(): void {
    this.authenticationService.logout();
  }
}
