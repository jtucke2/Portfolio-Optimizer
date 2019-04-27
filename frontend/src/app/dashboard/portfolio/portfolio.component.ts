import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IntervalEnum } from 'src/app/models/portfolio';
import { DashboardService } from '../dashboard.service';
import { globalVars } from 'src/app/global/global-vars';
import { Observable, merge as observableMerge, of as observableOf } from 'rxjs';
import { PricesExtended } from './tickers/tickers.component';
import { switchMap, map, startWith, catchError, debounceTime } from 'rxjs/operators';
import ArrayHelpers from 'src/app/global/helpers/array-helpers';
import { Prices } from 'src/app/models/price';
import ChartHelpers from 'src/app/global/helpers/chart-helpers';
import { SnackbarService } from 'src/app/global/services/snackbar.service';
import { Router } from '@angular/router';
import { CeleryState } from 'src/app/models/celery';

@Component({
  selector: 'portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit {
  public benchmarkPrices$: Observable<PricesExtended>;
  public lastValidPriceData: PricesExtended | Prices;
  public form = new FormGroup({
    name: new FormControl('', Validators.required),
    start_date: new FormControl(null, Validators.required),
    end_date: new FormControl(new Date(), Validators.required),
    interval: new FormControl(IntervalEnum.WEEKLY, Validators.required),
    tickers: new FormControl([], Validators.required),
    benchmark_index: new FormControl(globalVars.BENCHMARK_INDEXES[0].value, Validators.required)
  });
  public errorMessage = '';

  public benchmarkIndexes = globalVars.BENCHMARK_INDEXES;

  constructor(
    private dashboardService: DashboardService,
    private snackbarService: SnackbarService,
    private router: Router
  ) { }

  ngOnInit() {
    const lastYear = new Date();
    lastYear.setFullYear(lastYear.getFullYear() - 1);
    this.form.get('start_date').patchValue(lastYear);

    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);
    this.benchmarkPrices$ = observableMerge(
        this.form.get('benchmark_index').valueChanges,
        this.form.get('start_date').valueChanges,
        this.form.get('end_date').valueChanges
      )
      .pipe(
        startWith(this.form.get('benchmark_index').value),
        debounceTime(300),
        switchMap(() => {
          const { benchmark_index, start_date, end_date, interval } = this.form.value;
          return this.dashboardService.getPrices(benchmark_index, start_date, end_date, interval)
            .pipe(
              catchError(() => {
                return observableOf(this.lastValidPriceData);
              })
            );
        }),
        map((priceData) => {
          return {
            ...priceData,
            prices: ArrayHelpers.spaceOutArrayElements(priceData.prices, globalVars.NUMBER_OF_PRICES_TO_GRAPH)
          };
        }),
        map(priceData => {
          this.lastValidPriceData = priceData;
          const rawPrices = priceData.prices.map(p => p.close);
          let returnPercent: string | number = (rawPrices[rawPrices.length - 1] - rawPrices[0]) / rawPrices[0] * 100;
          returnPercent = returnPercent > 0 ? `+${returnPercent.toFixed(2)}` : returnPercent.toFixed(2);
          const chart = ChartHelpers.pricesToStockChart(priceData.prices, priceData.ticker);

          // Update name to full string
          const labelEl = this.benchmarkIndexes.find(bi => bi.value === priceData.ticker);
          priceData.ticker = labelEl.name;
          return {
            ...priceData,
            chart,
            returnPercent,
            startDate: this.form.get('start_date').value,
            endDate: this.form.get('end_date').value
          };
        })
      );
  }

  onFormSubmit() {
    this.dashboardService.submitJob(this.form.value)
      .subscribe(
        ({ task_id }) => {
          this.dashboardService.portfolioTasks.unshift({
            task_id,
            name: this.form.get('name').value,
            state: CeleryState.PENDING
          });
          console.log('~ portfolioTasks:\n', this.dashboardService.portfolioTasks);
          this.snackbarService.openSnackbar('Portfolio Successfully Created', null, 'Success');
          this.router.navigate(['dashboard', 'optimization']);
        },
        (err) => {
          console.log(err);
          this.errorMessage = 'Unable to Create Portfolio';
        }
      );
  }

}
