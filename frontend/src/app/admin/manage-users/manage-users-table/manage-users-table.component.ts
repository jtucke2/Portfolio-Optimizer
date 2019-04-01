import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { BehaviorSubject, Observable } from 'rxjs';

import { ManageUsersTableDataSource } from './manage-users-table-datasource';
import { AdminService } from 'src/app/admin/admin.service';
import { User, UserRoles } from 'src/app/models/user';

export type ManageUsersTableActions = 'approve' | 'delete' | 'promote';

@Component({
  selector: 'manage-users-table',
  templateUrl: './manage-users-table.component.html',
  styleUrls: ['./manage-users-table.component.scss']
})
export class ManageUsersTableComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @Input() public users$: BehaviorSubject<User[]>;
  @Input() public actions: ManageUsersTableActions[];
  @Output() public userApproved = new EventEmitter<User>();
  public dataSource: ManageUsersTableDataSource;
  public displayedColumns = ['first_name', 'last_name', 'email', 'action'];
  public message = '';
  public readonly ALERT_INTERVAL = 3000;

  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.dataSource = new ManageUsersTableDataSource(this.paginator, this.sort, this.users$);
  }

  public processUser(action: ManageUsersTableActions, user: User) {
    let obs: Observable<{ success: boolean, message?: string }> = null;
    switch (action) {
      case 'approve':
        obs = this.adminService.approveUser(user.user_id);
        break;
      case 'delete':
        obs = this.adminService.deleteUser(user.user_id);
        break;
      case 'promote':
        obs = this.adminService.promoteUserToAdmin(user.user_id);
        break;
    }
    obs
      .subscribe(
        ({ success, message }) => {
          if (success) {
            // tslint:disable-next-line: max-line-length
            this.message = `You have successfully ${action}d ${user.first_name} ${user.last_name}.`;
            const usersCp = [...this.users$.value];
            const userIndex = usersCp.findIndex((u) => u.user_id === user.user_id);
            if (action === 'approve' || action === 'delete') {
              if (userIndex > -1) {
                const approvedUserCp = { ...Object.assign({}, usersCp[userIndex])};
                if (action === 'approve') {
                  // Need to update approved users list from pending users list
                  this.userApproved.emit(approvedUserCp);
                }
                usersCp.splice(userIndex, 1);
                this.users$.next(usersCp);
              }
            } else if (action === 'promote') {
              if (userIndex > -1) {
                usersCp[userIndex].role = UserRoles.ADMIN;
                this.users$.next(usersCp);
              }
            }
          } else {
            this.message = message || `An error occured while attempting to ${action} ${user.first_name} ${user.last_name}.`;
          }
        }, (err) => {
          console.log(err);
          this.message = `An error occured while attempting to ${action} ${user.first_name} ${user.last_name}.`;
        }
      );
  }
}
