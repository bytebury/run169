import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./views/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'submit-result',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./views/submit-result/submit-result.module').then(
        (m) => m.SubmitResultModule
      ),
  },
  {
    path: 'races',
    loadChildren: () =>
      import('./views/races/races.module').then((m) => m.RacesModule),
  },
  {
    path: 'runners',
    loadChildren: () =>
      import('./views/runners/runners.module').then((m) => m.RunnersModule),
  },
  {
    path: '**',
    loadChildren: () =>
      import('./views/auth/auth.module').then((m) => m.AuthModule),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
