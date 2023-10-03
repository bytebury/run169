import { Component, ViewChild, computed, effect } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from './services/authentication.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDrawer } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  isLoggedIn = computed(() => this.authenticationService.isLoggedIn());
  authErrorMessage = computed(() => this.authenticationService.errorMessage());
  currentUser = computed(() => this.authenticationService.currentUser());

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  @ViewChild('drawer') drawerRef!: MatDrawer;

  constructor(
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
    this.drawerRef.close();
    this.authenticationService.logout();
  }
}
