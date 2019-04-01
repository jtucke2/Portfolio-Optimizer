import { Component, OnInit } from '@angular/core';

import { AdminService } from '../admin.service';
import { BehaviorSubject } from 'rxjs';
import { User } from 'src/app/models/user';

@Component({
  selector: 'manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements OnInit {
  public pendingUsers$: BehaviorSubject<User[]> = new BehaviorSubject([]);
  public approvedUsers$: BehaviorSubject<User[]> = new BehaviorSubject([]);

  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.adminService.getUnapprovedUsers()
      .subscribe((users) => this.pendingUsers$.next(users));
    this.adminService.getApprovedUsers()
      .subscribe((users) => this.approvedUsers$.next(users));
  }

  public userApproved(user: User) {
    const newApprovedUsersList = [...this.approvedUsers$.value, user];
    this.approvedUsers$.next(newApprovedUsersList);
  }

}
