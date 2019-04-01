import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminService } from './admin.service';
import { LayoutComponent } from './layout/layout.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { AdminRoutingModule } from './admin.routing';
import { MatTabsModule, MatTableModule, MatPaginatorModule, MatSortModule, MatButtonModule, MatTooltipModule } from '@angular/material';
import { ManageUsersTableComponent } from './manage-users/manage-users-table/manage-users-table.component';

@NgModule({
  declarations: [
    LayoutComponent,
    ManageUsersComponent,
    ManageUsersTableComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    MatTooltipModule
  ],
  providers: [
    AdminService
  ]
})
export class AdminModule { }
