import { Component, OnInit } from '@angular/core';
import { share, map, filter, tap, switchMap, withLatestFrom, startWith } from 'rxjs/operators';
import { Observable, combineLatest } from 'rxjs';

import { DashboardService } from '../../dashboard.service';
import { UserService } from 'src/app/global/services/user.service';
import { Portfolio } from 'src/app/models/portfolio';

@Component({
  selector: 'job-list',
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.scss']
})
export class JobListComponent implements OnInit {
  public userPortfolios$: Observable<Partial<Portfolio>[]>;
  public publishedPortfolios$: Observable<Partial<Portfolio>[]>;

  constructor(
    public dashboardService: DashboardService,
    private userService: UserService
  ) { }

  ngOnInit() {
    const masterList$ = this.dashboardService.retrievePortfolios$
      .pipe(
        filter(() => !!this.userService.user && !!this.userService.user.user_id),
        switchMap(() => this.dashboardService.getPortfolios()),
        map(portfolios => portfolios.sort((a, b) => {
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
