import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap, tap, debounceTime, share } from 'rxjs/operators';
import { DashboardService } from '../../dashboard.service';
import { Observable } from 'rxjs';
import { Portfolio } from 'src/app/models/portfolio';
import { globalVars } from 'src/app/global/global-vars';

@Component({
  selector: 'job-viewer',
  templateUrl: './job-viewer.component.html',
  styleUrls: ['./job-viewer.component.scss']
})
export class JobViewerComponent implements OnInit {
  public maxReturnsIdx = -1;
  public minStdDevIdx = -1;
  public portfolio$: Observable<Portfolio>;
  public benchmarkName: string;
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
          const biTicker = portfolio.benchmark_index.asset_data.ticker;
          const biObj = globalVars.BENCHMARK_INDEXES.find(bi => bi.value === biTicker);
          this.benchmarkName = biObj ? biObj.name : biTicker;
          this.loading = false;
          this.maxReturnsIdx = portfolio.matrices.avg_returns_vec.indexOf(Math.max(...portfolio.matrices.avg_returns_vec));
          this.minStdDevIdx = portfolio.matrices.std_dev_vec.indexOf(Math.min(...portfolio.matrices.std_dev_vec));
        })
      );
  }

}
