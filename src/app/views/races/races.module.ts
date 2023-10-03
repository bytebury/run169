import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateRaceComponent } from './create-race/create-race.component';
import { RacesRoutingModule } from './races-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [CreateRaceComponent],
  imports: [
    CommonModule,
    RacesRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatSlideToggleModule,
    MatAutocompleteModule,
    MatSnackBarModule,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RacesModule {}
