import { Component, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DashboardService } from '../../dashboard.service';
import { Prices } from 'src/app/models/price';
import { StockChart } from 'angular-highcharts';
import ArrayHelpers from 'src/app/global/helpers/array-helpers';
import { map, switchMap, startWith, debounceTime, filter, tap } from 'rxjs/operators';
import { merge as observableMerge } from 'rxjs';
import { globalVars } from 'src/app/global/global-vars';
import ChartHelpers from 'src/app/global/helpers/chart-helpers';

export interface PricesExtended extends Prices {
  chart: StockChart;
  returnPercent: number | string;
  startDate: Date;
  endDate: Date;
  dateSyncError: boolean;
}

@Component({
  selector: 'tickers',
  templateUrl: './tickers.component.html',
  styleUrls: ['./tickers.component.scss']
})
export class TickersComponent implements OnDestroy {
  @Input() public form: FormGroup;
  public tickerForm = new FormGroup({
    ticker: new FormControl('', Validators.required)
  });
  public errorMessage = '';
  public priceDataArr: PricesExtended[] = [];
  public hideTickerInput = false;
  public getPricesArr = [];
  public tempTickers = [];

  @Output() public dateSyncChange = new EventEmitter<boolean>();

  @Input() public get dateSync() { return this.dateSyncValue; }

  public set dateSync(sync) {
    this.dateSyncValue = true;
    this.dateSyncChange.emit(sync);
  }

  private dateSyncValue = true;

  constructor(private dashboardService: DashboardService) { }

  ngOnDestroy() {
    this.getPricesArr.forEach((getPrices$) => getPrices$ && getPrices$.unsubscribe());
  }

  public tickerCtrlSubmit() {
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);
    const ticker = this.tickerForm.get('ticker').value.toUpperCase();
    if (this.form.get('tickers').value.includes(ticker)) {
      this.errorMessage = `${ticker} is already included in the portfolio.`;
    } else if (this.tempTickers.includes(ticker)) {
      this.errorMessage = `${ticker} was already submitted.`;
    } else {
      this.tempTickers.push(ticker);
      this.tickerForm.get('ticker').reset();
      const { start_date, end_date, interval } = this.form.value;
      const getPrices$ = this.dashboardService.getPrices(ticker, start_date, end_date, interval)
        .pipe(
          switchMap((priceData) => {
            // Update prices if the date range is changed
            return observableMerge(this.form.get('start_date').valueChanges, this.form.get('end_date').valueChanges)
              .pipe(
                debounceTime(300),
                // This is so the price isn't retrived again if the ticker is deleted
                filter(() => this.form.get('tickers').value.includes(ticker)),
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
            // Add ticker to parent form
            const tickers = this.form.get('tickers').value;
            if (!tickers.includes(ticker)) {
              tickers.push(ticker);
              this.form.get('tickers').patchValue(tickers);
            }

            this.removeTempTicker(ticker);

            // Generate chart data
            const rawPrices = priceData.prices.map(p => p.close);
            let returnPercent: string | number = (rawPrices[rawPrices.length - 1] - rawPrices[0]) / rawPrices[0] * 100;
            returnPercent = returnPercent > 0 ? `+${returnPercent.toFixed(2)}` : returnPercent.toFixed(2);
            const chart = ChartHelpers.pricesToStockChart(priceData.prices, priceData.ticker);

            const data = {
              ...priceData,
              chart,
              returnPercent,
              startDate: this.form.get('start_date').value,
              endDate: this.form.get('end_date').value,
              dateSyncError: false
            };
            const currentIndex = this.priceDataArr.findIndex(pd => pd.ticker === priceData.ticker);
            if (currentIndex > -1) {
              this.priceDataArr[currentIndex] = data;
            } else {
              this.priceDataArr.push(data);
            }
            this.validateDateSync();
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
            this.removeTempTicker(ticker);
          }
        );
      this.getPricesArr.push(getPrices$);
    }
  }

  public removeAsset(idx: number, ticker: string) {
    this.removeTempTicker(ticker);
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
    this.validateDateSync();
  }

  public trackByFn(index: number, item: PricesExtended) {
    return item.ticker;
  }

  private removeTempTicker(ticker: string) {
    const tempTickerIdx = this.tempTickers.indexOf(ticker);
    if (tempTickerIdx > 0) {
      this.tempTickers.splice(tempTickerIdx, 1);
    }
  }

  /**
   * @description Validate that the date of the asset prices are synchronized
   */
  private validateDateSync() {
    const priceLengths = this.priceDataArr
      .map(pD => pD.prices.length);

    const lengthsEqual = priceLengths
      .every((el, _, arr) => el === arr[0]);

    this.dateSync = lengthsEqual;

    const maxLength = Math.max(...priceLengths);

    priceLengths.forEach((pL, i) => {
      if (pL < maxLength) {
        this.priceDataArr[i].dateSyncError = true;
      } else {
        this.priceDataArr[i].dateSyncError = false;
      }
    });
  }
}
