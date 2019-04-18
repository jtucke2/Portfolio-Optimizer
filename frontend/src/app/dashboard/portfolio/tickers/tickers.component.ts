import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DashboardService } from '../../dashboard.service';
import { Prices } from 'src/app/models/price';
import { Label as ng2ChartLabel} from 'ng2-charts';
import { ChartDataSets } from 'chart.js';
import ArrayHelpers from 'src/app/global/helpers/array-helpers';
import { map, switchMap, startWith, debounceTime } from 'rxjs/operators';
import { merge as observableMerge } from 'rxjs';
import { globalVars } from 'src/app/global/global-vars';

export interface PricesExtended extends Prices {
  chartData: ChartDataSets[];
  chartLabels: ng2ChartLabel[];
  returnPercent: number | string;
}

@Component({
  selector: 'tickers',
  templateUrl: './tickers.component.html',
  styleUrls: ['./tickers.component.scss']
})
export class TickersComponent implements OnInit {
  @Input() public form: FormGroup;
  public tickerForm = new FormGroup({
    ticker: new FormControl('', Validators.required)
  });
  public errorMessage = '';
  public priceDataArr: PricesExtended[] = [];
  public hideTickerInput = false;

  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
  }

  public tickerCtrlSubmit() {
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);
    const ticker = this.tickerForm.get('ticker').value.toUpperCase();
    if (this.form.get('tickers').value.includes(ticker)) {
      this.errorMessage = `${ticker} is already included in the portfolio.`;
    } else {
      const tickers = this.form.get('tickers').value;
      tickers.push(ticker);
      this.form.get('tickers').patchValue(tickers);
      this.tickerForm.get('ticker').reset();
      const { start_date, end_date, interval } = this.form.value;
      const getPrices$ = this.dashboardService.getPrices(ticker, start_date, end_date, interval)
        .pipe(
          switchMap((priceData) => {
            return observableMerge(this.form.get('start_date').valueChanges, this.form.get('start_date').valueChanges)
              .pipe(
                debounceTime(300),
                switchMap(() => {
                  const { start_date: sd, end_date: ed, interval: it } = this.form.value;
                  return this.dashboardService.getPrices(ticker, sd, ed, it);
                }),
                startWith(priceData)
              );
          }),
          map((priceData) => {
            return {
              ...priceData,
              prices: ArrayHelpers.spaceOutArrayElements(priceData.prices, globalVars.NUMBER_OF_PRICES_TO_GRAPH)
            };
          })
        )
        .subscribe(
          (priceData) => {
            const pricesRounded = priceData.prices.map(p => parseFloat(parseFloat(p.close as any).toFixed(2)));
            const chartData = [{ data: pricesRounded, label: ticker }];
            const chartLabels = priceData.prices.map(p => p.date);
            const rawPrices = priceData.prices.map(p => p.close);
            let returnPercent: string | number = (rawPrices[rawPrices.length - 1] - rawPrices[0]) / rawPrices[0] * 100;
            returnPercent = returnPercent > 0 ? `+${returnPercent.toFixed(2)}` : returnPercent.toFixed(2);
            const data = {
              ...priceData,
              chartData,
              chartLabels,
              returnPercent
            };
            const currentIndex = this.priceDataArr.findIndex(pd => pd.ticker === priceData.ticker);
            if (currentIndex > -1) {
              this.priceDataArr[currentIndex] = data;
            } else {
              this.priceDataArr.push(data);
            }
          },
          (err) => {
            console.log(err);
            const tickersNew = this.form.get('tickers').value;
            const tickerIdx = tickersNew.indexOf(ticker);
            if (tickerIdx > -1) {
              tickersNew.splice(tickerIdx, 1);
              this.form.get('tickers').patchValue(tickersNew);
            } else {
              console.log('Unable to find ticker to remove from parent form');
            }
            this.errorMessage = `Unable to retrieve price data for ${ticker}.`;
          }
        );
    }
  }

  public removeAsset(idx: number, ticker: string) {
    const priceDataCp = [...this.priceDataArr];
    priceDataCp.splice(idx, 1);
    this.priceDataArr = priceDataCp;
    const tickers = this.form.get('tickers').value;
    const tickerIdx = tickers.indexOf(ticker);
    if (tickerIdx > -1) {
      tickers.splice(tickerIdx, 1);
      this.form.get('tickers').patchValue(tickers);
    } else {
      console.log('Unable to find ticker to remove from parent form');
    }
  }

  public trackByFn(index: number, item: PricesExtended) {
    return item.ticker;
  }
}
