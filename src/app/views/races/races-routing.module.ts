import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateComponent } from './create/create.component';
import { ShowComponent } from './show/show.component';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { IndexComponent } from './index/index.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: IndexComponent,
  },
  {
    path: 'create',
    pathMatch: 'full',
    canActivate: [AuthGuard],
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
