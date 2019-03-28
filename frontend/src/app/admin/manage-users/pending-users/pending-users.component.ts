import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../admin.service';

@Component({
  selector: 'pending-users',
  templateUrl: './pending-users.component.html',
  styleUrls: ['./pending-users.component.scss']
})
export class PendingUsersComponent implements OnInit {
  public pendingUsers$;

  constructor(private adminService: AdminService) { }

  ngOnInit() {
    this.pendingUsers$ = this.adminService.getUnapprovedUsers();
  }

}
