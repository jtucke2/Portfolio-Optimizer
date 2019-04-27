import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../dashboard.service';

@Component({
  selector: 'select-job-msg',
  templateUrl: './select-job-msg.component.html',
  styleUrls: ['./select-job-msg.component.scss']
})
export class SelectJobMsgComponent implements OnInit {
  public displayedColumns = ['name', 'state'];

  constructor(public dashboardService: DashboardService) { }

  ngOnInit() {
  }

}
