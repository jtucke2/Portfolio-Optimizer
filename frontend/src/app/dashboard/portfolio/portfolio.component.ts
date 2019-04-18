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

  public benchmarkIndexes = globalVars.BENCHMARK_INDEXES;

  constructor(private dashboardService: DashboardService) { }

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
          this.lastValidPriceData = priceData;
          return {
            ...priceData,
            prices: ArrayHelpers.spaceOutArrayElements(priceData.prices, globalVars.NUMBER_OF_PRICES_TO_GRAPH)
          };
        }),
        map(priceData => {
          const prices = priceData.prices.map(p => parseFloat(parseFloat(p.close as any).toFixed(2)));
          const chartData = [{ data: prices, label: priceData.ticker }];
          const chartLabels = priceData.prices.map(p => p.date);
          const rawPrices = priceData.prices.map(p => p.close);
          let returnPercent: string | number = (rawPrices[rawPrices.length - 1] - rawPrices[0]) / rawPrices[0] * 100;
          returnPercent = returnPercent > 0 ? `+${returnPercent.toFixed(2)}` : returnPercent.toFixed(2);

          // Update name to full string
          const labelEl = this.benchmarkIndexes.find(bi => bi.value === priceData.ticker);
          priceData.ticker = labelEl.name;
          return {
            ...priceData,
            chartData,
            chartLabels,
            returnPercent
          };
        })
      );
  }

  onFormSubmit() {
    this.dashboardService.submitJob(this.form.value)
      .subscribe(
        (jobReturn) => {
          console.log(jobReturn);
        },
        (err) => {
          console.log(err);
        }
      );
  }

}
