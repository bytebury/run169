import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateComponent } from './create/create.component';
import { RacesRoutingModule } from './races-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ShowComponent } from './show/show.component';
import { MatIconModule } from '@angular/material/icon';
import { DistancePipe } from '../../pipes/distance.pipe';
import { UpcomingComponent } from './upcoming/upcoming.component';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RaceTimePipe } from '../../pipes/race-time.pipe';
import { PreviousComponent } from './previous/previous.component';
import { IndexComponent } from './index/index.component';
import { TownTypeaheadComponent } from 'src/app/components/town-typeahead/town-typeahead.component';

@NgModule({
  declarations: [
    CreateComponent,
    ShowComponent,
    UpcomingComponent,
    PreviousComponent,
    IndexComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    CommonModule,
    RacesRoutingModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatAutocompleteModule,
    MatSnackBarModule,
    MatIconModule,
    DistancePipe,
    MatTabsModule,
    MatMenuModule,
    MatProgressBarModule,
    RaceTimePipe,
    TownTypeaheadComponent,
  ],
})
export class RacesModule {}
