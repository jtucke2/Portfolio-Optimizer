import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map, switchMap, tap, debounceTime, take } from 'rxjs/operators';
import { DashboardService } from '../../dashboard.service';
import { Observable, ReplaySubject, EMPTY, Subject, merge } from 'rxjs';
import { Portfolio, OptimizationResult, OptimizeGoal } from 'src/app/models/portfolio';
import { globalVars } from 'src/app/global/global-vars';
import { MatDialog } from '@angular/material';
import { RenamePortfolioDialogComponent, RenameCloseResult } from './rename-portfolio-dialog/rename-portfolio-dialog.component';
import { DeletePortfolioDialogComponent } from './delete-portfolio-dialog/delete-portfolio-dialog.component';
import { SnackbarService } from 'src/app/global/services/snackbar.service';
import { UserService } from 'src/app/global/services/user.service';

@Component({
  selector: 'job-viewer',
  templateUrl: './job-viewer.component.html',
  styleUrls: ['./job-viewer.component.scss']
})
export class JobViewerComponent implements OnInit {
  public maxReturnsIdx = -1;
  public minStdDevIdx = -1;
  public portfolio$: Observable<Portfolio>;
  public updatePortfolio$: Subject<Portfolio> = new Subject();
  public benchmarkName: string;
  public loading = true;
  public showDetails = false;
  public errorMessage  = '';
  // This is to toggle the published icon without reloading the portfolio
  public tempPublished = false;
  public optimizationResult$: ReplaySubject<OptimizationResult> = new ReplaySubject();
  public equalWeightResults$: ReplaySubject<OptimizationResult> = new ReplaySubject();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dashboardService: DashboardService,
    private snackbarService: SnackbarService,
    private dialog: MatDialog,
    public userService: UserService
  ) { }

  ngOnInit() {
    const portfolioFromRoute$ = this.route.paramMap
      .pipe(
        debounceTime(50),
        map((params) => params.get('id')),
        tap(() => {
          this.tempPublished = false;
          this.loading = true;
          this.maxReturnsIdx = -1;
          this.minStdDevIdx = -1;
          this.benchmarkName = '';
          this.showDetails = false;
        }),
        switchMap(id => this.dashboardService.getPortfolioById(id)),
        tap((portfolio) => {
          const biTicker = portfolio.benchmark_index.asset_data.ticker;
          const biObj = globalVars.BENCHMARK_INDEXES.find(bi => bi.value === biTicker);
          this.benchmarkName = biObj ? biObj.name : biTicker;
          this.loading = false;
          this.maxReturnsIdx = portfolio.matrices.avg_returns_vec.indexOf(Math.max(...portfolio.matrices.avg_returns_vec));
          this.minStdDevIdx = portfolio.matrices.std_dev_vec.indexOf(Math.min(...portfolio.matrices.std_dev_vec));

          const findEqualWeight = portfolio.results.find(opt => opt.goal === OptimizeGoal.EQUAL_WEIGHT);
          if (findEqualWeight) {
            this.equalWeightResults$.next(findEqualWeight);
          } else {
            this.equalWeightResults$.next(null);
          }

          const findOptRes = portfolio.results.find(opt => opt.goal !== OptimizeGoal.EQUAL_WEIGHT);
          if (findOptRes) {
            this.optimizationResult$.next(findOptRes);
            this.showDetails = true;
          } else {
            this.showDetails = true;
          }

          // Remove 'new' badge if it exists
          if (this.dashboardService.listBadge[portfolio._id]) {
            delete this.dashboardService.listBadge[portfolio._id];
          }

          // Remove portfolio from pending list
          const taskIdx = this.dashboardService.portfolioTasks.findIndex(t => t.task_id === portfolio.task_id);
          if (taskIdx > -1) {
            this.dashboardService.portfolioTasks.splice(taskIdx, 1);
          }
        })
      );

    this.portfolio$ = merge(portfolioFromRoute$, this.updatePortfolio$);

    this.updatePortfolio$.subscribe(() => this.dashboardService.retrievePortfolios$.next(null));
  }

  public publishPortfolio(id: string) {
    this.dashboardService.publishPortfolio(id)
      .subscribe(
        (res) => {
          this.tempPublished = true;
        },
        (err) => {
          this.errorMessage = err.message || 'An unknown error occured.';
        }
      );
  }

  public openRenameDialog(portfolio: Portfolio) {
    const dialogRef = this.dialog.open(RenamePortfolioDialogComponent, {
      width: '400px',
      maxWidth: '90vh',
      data: portfolio
    });

    dialogRef.afterClosed()
      .pipe(
        take(1),
        switchMap((result: RenameCloseResult) => {
          if (result && result.action === 'save' && result.nameChanged) {
            return this.dashboardService.renamePortfolio(result.portfolioState._id, result.portfolioState.name);
          } else {
            return EMPTY;
          }
        })
      )
      .subscribe(res => {
        if (res && res.success && res.portfolio) {
          this.updatePortfolio$.next(res.portfolio);
        }
      });
  }

  public openDeleteDialog(portfolio: Portfolio) {
    const dialogRef = this.dialog.open(DeletePortfolioDialogComponent, {
      width: '400px',
      maxWidth: '90vh',
      data: portfolio
    });

    dialogRef.afterClosed()
      .pipe(
        take(1),
        switchMap((result) => {
          if (result && result.action === 'delete' && result.portfolioState) {
            return this.dashboardService.deletePortfolio(result.portfolioState._id);
          } else {
            return EMPTY;
          }
        })
      )
      .subscribe(res => {
        if (res && res.success) {
          this.router.navigate(['dashboard', 'optimization']);
          this.dashboardService.retrievePortfolios$.next(null);

          if (res.message) {
            this.snackbarService.openSnackbar(res.message);
          }
        }
      });
  }

}
