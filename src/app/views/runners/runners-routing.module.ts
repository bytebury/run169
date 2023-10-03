import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ShowComponent } from './show/show.component';

const routes: Routes = [
  {
    path: ':runner_id',
    component: ShowComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RunnersRoutingModule {}
