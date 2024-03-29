import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShowComponent } from './show/show.component';
import { RunnersRoutingModule } from './runners-routing.module';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { IndexComponent } from './index/index.component';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { DistancePipe } from '../../pipes/distance.pipe';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RaceTimePipe } from '../../pipes/race-time.pipe';
import { MilePacePipe } from '../../pipes/mile-pace.pipe';
import { KilometerPacePipe } from '../../pipes/kilometer-pace.pipe';
import { MatCardModule } from '@angular/material/card';
import { DonutChartComponent } from '../../components/charts/donut-chart/donut-chart.component';
import { ConnecticutMapComponent } from '../../components/charts/connecticut-map/connecticut-map.component';

@NgModule({
  declarations: [ShowComponent, IndexComponent],
  imports: [
    CommonModule,
    RunnersRoutingModule,
    MatTabsModule,
    MatTableModule,
    MatCardModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    DistancePipe,
    MatIconModule,
    MatDialogModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    RaceTimePipe,
    MilePacePipe,
    KilometerPacePipe,
    DonutChartComponent,
    ConnecticutMapComponent,
  ],
})
export class RunnersModule {}
