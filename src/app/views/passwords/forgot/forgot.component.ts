import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { take } from 'rxjs';
import { PasswordService } from 'src/app/services/password.service';

@Component({
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.scss'],
})
export class ForgotComponent {
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  constructor(
    private snackbar: MatSnackBar,
    private password: PasswordService
  ) {}

  submitForm(): void {
    this.password
      .forgot(this.form.get('email')?.value!)
      .pipe(take(1))
      .subscribe({
        next: (response: any) => {
          this.snackbar.open(response.message, 'Dismiss');
        },
        error: (error) => {
          this.snackbar.open(error, 'Dismiss');
        },
      });
  }
}
