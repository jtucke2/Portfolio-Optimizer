import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap, tap, debounceTime } from 'rxjs/operators';
import { DashboardService } from '../../dashboard.service';
import { Observable } from 'rxjs';
import { Portfolio } from 'src/app/models/portfolio';

@Component({
  selector: 'job-viewer',
  templateUrl: './job-viewer.component.html',
  styleUrls: ['./job-viewer.component.scss']
})
export class JobViewerComponent implements OnInit {
  public maxReturnsIdx = -1;
  public minStdDevIdx = -1;
  public portfolio$: Observable<Portfolio>;
  public loading = true;

  constructor(
    private route: ActivatedRoute,
    private dashboardService: DashboardService
  ) { }

  ngOnInit() {
    this.portfolio$ = this.route.paramMap
      .pipe(
        debounceTime(50),
        map((params) => params.get('id')),
        tap(() => {
          this.loading = true;
          this.maxReturnsIdx = -1;
          this.minStdDevIdx = -1;
        }),
        switchMap(id => this.dashboardService.getPortfolioById(id)),
        tap((portfolio) => {
          this.loading = false;
          this.maxReturnsIdx = portfolio.matrices.avg_returns_vec.indexOf(Math.max(...portfolio.matrices.avg_returns_vec));
          this.minStdDevIdx = portfolio.matrices.std_dev_vec.indexOf(Math.min(...portfolio.matrices.std_dev_vec));
        })
      );
  }

}
