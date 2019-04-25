import { Component, OnInit } from '@angular/core';

import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'optimization',
  templateUrl: './optimization.component.html',
  styleUrls: ['./optimization.component.scss']
})
export class OptimizationComponent implements OnInit {
  constructor(public dashboardService: DashboardService) { }

  ngOnInit() {
  }

}
