import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateComponent } from './create/create.component';
import { ShowComponent } from './show/show.component';
import { UpcomingComponent } from './upcoming/upcoming.component';
import { AuthGuard } from 'src/app/guards/auth.guard';

const routes: Routes = [
  {
    path: 'create',
    pathMatch: 'full',
    canActivate: [AuthGuard],
    component: CreateComponent,
  },
  {
    path: 'upcoming',
    pathMatch: 'full',
    component: UpcomingComponent,
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
