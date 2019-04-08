import { Component, OnInit } from '@angular/core';
import { share, map, filter, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { DashboardService } from '../../dashboard.service';
import { UserService } from 'src/app/global/services/user.service';

@Component({
  selector: 'job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss']
})
export class JobListComponent implements OnInit {
  public userPortfolios$: Observable<any>;
  public publishedPortfolios$: Observable<any>;

  constructor(
    private dashboardService: DashboardService,
    private userService: UserService
  ) { }

  ngOnInit() {
    const masterList$ = this.dashboardService.getPortfolios()
      .pipe(
        filter(() => !!this.userService.user && !!this.userService.user.user_id),
        map((portfolios) => portfolios.sort((a, b) => {
          if (a.job_end.$date < b.job_end.$date) {
            return 1;
          } else {
            return -1;
          }
        })),
        share()
      );

    this.userPortfolios$ = masterList$
      .pipe(
        map((portfolios) => portfolios.filter(p => p.user_id === this.userService.user.user_id))
      );

    this.publishedPortfolios$ = masterList$
      .pipe(
        map((portfolios) => portfolios.filter(p => p.user_id !== this.userService.user.user_id && p.published))
      );
  }

}
