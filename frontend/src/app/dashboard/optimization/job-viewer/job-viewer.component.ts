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
  private portfolio$: Observable<Portfolio>;
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

}
