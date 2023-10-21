import { Component, OnInit, computed, effect } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  errorMessages = computed(() => this.authService.errorMessage());

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(
    private authService: AuthenticationService,
    private snackbar: MatSnackBar,
    private router: Router
  ) {
    effect(() => {
      if (this.errorMessages()) {
        this.snackbar
          .open(this.errorMessages(), 'Dismiss')
          .afterDismissed()
          .subscribe({
            next: () => {
              this.authService.errorMessage.set('');
            },
          });
      }
    });
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/']);
    }
  }

  login(): void {
    const email = this.loginForm.get('email')?.value ?? '';
    const password = this.loginForm.get('password')?.value ?? '';

    this.authService.login(email, password);
  }
}
