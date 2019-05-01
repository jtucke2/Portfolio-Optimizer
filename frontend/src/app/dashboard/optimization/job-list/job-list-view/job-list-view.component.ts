import { Component, OnInit, Input } from '@angular/core';

import { Portfolio } from 'src/app/models/portfolio';
import { ListBadge } from 'src/app/dashboard/dashboard.service';

@Component({
  selector: 'job-list-view',
  templateUrl: './job-list-view.component.html',
  styleUrls: ['./job-list-view.component.scss']
})
export class JobListViewComponent implements OnInit {
  @Input() public portfolios: Partial<Portfolio>[];
  @Input() public listBadge: ListBadge;

  constructor() { }

  ngOnInit() {
  }

}
