import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort } from '@angular/material';
import { Subject } from 'rxjs';

import { PendingUsersTableDataSource } from './pending-users-table-datasource';
import { AdminService } from 'src/app/admin/admin.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'pending-users-table',
  templateUrl: './pending-users-table.component.html',
  styleUrls: ['./pending-users-table.component.css']
})
export class PendingUsersTableComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  public userSubject: Subject<User[]> = new Subject();
  public dataSource: PendingUsersTableDataSource;
  public displayedColumns = ['first_name', 'last_name', 'email', 'action'];
  public message = '';

  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.adminService.getUnapprovedUsers()
      .subscribe((users) => this.userSubject.next(users));    
    this.dataSource = new PendingUsersTableDataSource(this.paginator, this.sort, this.userSubject);
  }

  public approveUser(user: User) {
    this.adminService.approveUser(user.user_id)
      .subscribe(({success, message }) => {
        if (success) {
          this.message = `You have successfully approved ${user.first_name} ${user.last_name} to use the application.`;
        } else {
          this.message = message || `An error occured while attempting to approve ${user.first_name} ${user.last_name}.`;
        }
      }, (err) => {
        console.log(err);
        this.message = `An error occured while attempting to approve ${user.first_name} ${user.last_name}.`;
      });
  }

  public denyUser(user: User) {
    this.adminService.deleteUser(user.user_id)
      .subscribe(({ success, message }) => {
        if (success) {
          this.message = `You have successfully deleted ${user.first_name} ${user.last_name} from the application.`;
        } else {
          this.message = message || `An error occured while attempting to delete ${user.first_name} ${user.last_name}.`;
        }
      }, (err) => {
        console.log(err);
        this.message = `An error occured while attempting to delete ${user.first_name} ${user.last_name}.`;
      });
  }
}
