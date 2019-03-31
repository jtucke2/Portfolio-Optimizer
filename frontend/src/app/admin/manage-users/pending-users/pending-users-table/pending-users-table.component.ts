import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { BehaviorSubject } from 'rxjs';

import { PendingUsersTableDataSource } from './pending-users-table-datasource';
import { AdminService } from 'src/app/admin/admin.service';
import { User } from 'src/app/models/user';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'pending-users-table',
  templateUrl: './pending-users-table.component.html',
  styleUrls: ['./pending-users-table.component.css']
})
export class PendingUsersTableComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public userSubject: BehaviorSubject<User[]> = new BehaviorSubject([]);
  public dataSource: PendingUsersTableDataSource;
  public displayedColumns = ['first_name', 'last_name', 'email', 'action'];
  public message = '';
  public readonly ALERT_INTERVAL = 3000;

  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.adminService.getUnapprovedUsers()
      .subscribe((users) => this.userSubject.next(users));
    this.dataSource = new PendingUsersTableDataSource(this.paginator, this.sort, this.userSubject);
  }

  public processUser(action: 'approve' | 'delete', user: User) {
    const obs = action === 'approve' ? this.adminService.approveUser(user.user_id) : this.adminService.deleteUser(user.user_id);
    obs
      .subscribe(
        ({success, message}) => {
          if (success) {
            // tslint:disable-next-line: max-line-length
            this.message = `You have successfully ${action}d ${user.first_name} ${user.last_name} ${action === 'approve' ? 'to use' : 'from'} the application.`;
            const usersCp = [...this.userSubject.value];
            const deleteIndex = usersCp.findIndex((u) => u.user_id === user.user_id);
            if (deleteIndex > -1) {
              usersCp.splice(deleteIndex, 1);
              this.userSubject.next(usersCp);
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
