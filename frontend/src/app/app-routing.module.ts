import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LandingPageComponent } from './global/components/landing-page/landing-page.component';
import { userRoutes } from './user/user.routes';
import { dashboardRoutes } from './dashboard/dashboard.routes';
import { AuthGuard } from './global/services/auth.guard';
import { UserRoles } from './models/user';

const routes: Routes = [
  { path: 'home', component: LandingPageComponent },
  { path: 'user', children: userRoutes },
  {
    path: 'dashboard',
    children: dashboardRoutes,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    loadChildren: './admin/admin.module#AdminModule',
    canActivate: [AuthGuard],
    data: {
      allowedRoles: [
        UserRoles.ADMIN
      ]
    }
  },

  { path: '', redirectTo: 'home', pathMatch: 'full' },
  // { path: '**', component: NoContentComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
