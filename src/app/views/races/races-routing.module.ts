import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateRaceComponent } from './create-race/create-race.component';

const routes: Routes = [
  {
    path: '',
    component: CreateRaceComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RacesRoutingModule {}
