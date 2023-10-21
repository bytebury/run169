import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PasswordsRoutingModule } from './passwords-routing.module';
import { ResetComponent } from './reset/reset.component';
import { ForgotComponent } from './forgot/forgot.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [ResetComponent, ForgotComponent],
  imports: [
    CommonModule,
    PasswordsRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
})
export class PasswordsModule {}
