import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SubmitResultComponent } from './submit-result/submit-result.component';

const routes: Routes = [
  {
    path: '',
    component: SubmitResultComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubmitResultRoutingModule {}
