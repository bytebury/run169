import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubmitResultComponent } from './submit-result/submit-result.component';
import { SubmitResultRoutingModule } from './submit-result-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TimeFormatDirective } from 'src/app/directives/time-format.directive';
import { DistancePipe } from '../../pipes/distance.pipe';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  declarations: [SubmitResultComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    SubmitResultRoutingModule,
    TimeFormatDirective,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatSlideToggleModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    DistancePipe,
    MatProgressBarModule,
  ],
})
export class SubmitResultModule {}
