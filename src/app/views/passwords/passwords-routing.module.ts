import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResetComponent } from './reset/reset.component';
import { ForgotComponent } from './forgot/forgot.component';

const routes: Routes = [
  {
    path: 'reset',
    pathMatch: 'full',
    component: ResetComponent,
  },
  {
    path: 'forgot',
    component: ForgotComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PasswordsRoutingModule {}
