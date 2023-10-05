import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateComponent } from './create/create.component';
import { RacesRoutingModule } from './races-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ShowComponent } from './show/show.component';
import { MatIconModule } from '@angular/material/icon';
import { DistancePipe } from '../../pipes/distance.pipe';
import { UpcomingComponent } from './upcoming/upcoming.component';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  declarations: [CreateComponent, ShowComponent, UpcomingComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    RacesRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatSlideToggleModule,
    MatTableModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatIconModule,
    DistancePipe,
  ],
})
export class RacesModule {}
