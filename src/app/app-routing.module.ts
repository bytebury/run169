import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'submit-result',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./views/submit-result/submit-result.module').then(
        (m) => m.SubmitResultModule
      ),
  },
  {
    path: 'create-race',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./views/races/races.module').then((m) => m.RacesModule),
  },
  {
    path: 'runners',
    loadChildren: () =>
      import('./views/runners/runners.module').then((m) => m.RunnersModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
