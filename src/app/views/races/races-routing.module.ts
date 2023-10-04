import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateComponent } from './create/create.component';
import { ShowComponent } from './show/show.component';

const routes: Routes = [
  {
    path: 'create',
    pathMatch: 'full',
    component: CreateComponent,
  },
  {
    path: ':id',
    component: ShowComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RacesRoutingModule {}
