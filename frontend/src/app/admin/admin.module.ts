import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminService } from './admin.service';
import { LayoutComponent } from './layout/layout.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { AdminRoutingModule } from './admin.routing';
import { MatTabsModule } from '@angular/material';
import { PendingUsersComponent } from './manage-users/pending-users/pending-users.component';

@NgModule({
  declarations: [LayoutComponent, ManageUsersComponent, PendingUsersComponent],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatTabsModule
  ],
  providers: [
    AdminService
  ]
})
export class AdminModule { }
