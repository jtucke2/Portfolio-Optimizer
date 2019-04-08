import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap, tap, debounceTime } from 'rxjs/operators';
import { DashboardService } from '../../dashboard.service';

@Component({
  selector: 'job-viewer',
  templateUrl: './job-viewer.component.html',
  styleUrls: ['./job-viewer.component.scss']
})
export class JobViewerComponent implements OnInit, OnDestroy {
  private portfolio$;
  private loading = true;

  constructor(
    private route: ActivatedRoute,
    private dashboardService: DashboardService
  ) { }

  ngOnInit() {
    this.portfolio$ = this.route.paramMap
      .pipe(
        debounceTime(50),
        map((params) => params.get('id')),
        tap(() => this.loading = true),
        switchMap(id => this.dashboardService.getPortfolioById(id)),
        tap(() => this.loading = false)
      );
  }

  ngOnDestroy() {
    if (this.portfolio$) {
      this.portfolio$.unsubscribe();
    }
  }

}
