import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { take } from 'rxjs';
import { PasswordService } from 'src/app/services/password.service';

@Component({
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss'],
})
export class ResetComponent implements OnInit {
  token = '';
  form = new FormGroup({
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

  constructor(
    private snackbar: MatSnackBar,
    private password: PasswordService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.token = params.get('token') ?? '';
    });
  }

  submitForm(): void {
    if (
      this.form.get('password')!.value ===
      this.form.get('confirmPassword')!.value
    ) {
      const request = {
        password: this.form.get('password')!.value ?? '',
        token: this.token,
      };

      this.password
        .reset(request)
        .pipe(take(1))
        .subscribe({
          next: (response: any) => {
            this.snackbar.open(response.message, 'Dismiss');
            this.router.navigate(['login']);
          },
          error: (error) => {
            this.snackbar.open(error.error.message, 'Dismiss');
          },
        });
    } else {
      this.snackbar.open('Passwords do not match', 'Dismiss');
    }
  }
}
