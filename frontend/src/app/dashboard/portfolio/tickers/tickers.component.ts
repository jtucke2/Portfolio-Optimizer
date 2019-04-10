import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DashboardService } from '../../dashboard.service';
import { IntervalEnum } from 'src/app/models/portfolio';
import { Prices } from 'src/app/models/price';
import { Label as ng2ChartLabel} from 'ng2-charts';
import { ChartDataSets } from 'chart.js';

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
      this.tickerForm.reset();
      const getPrices$ = this.dashboardService.getPrices(ticker, startDate, new Date(), IntervalEnum.MONTHLY)
        .subscribe(
          (priceData) => {
            const prices = priceData.prices.map(p => parseFloat(parseFloat(p.close as any).toFixed(2)));
            const chartData = [{ data: prices, label: ticker }];
            const chartLabels = priceData.prices.map(p => p.date);
            const rawPrices = priceData.prices.map(p => p.close);
            let returnPercent: string | number = (rawPrices[rawPrices.length - 1] - rawPrices[0]) / rawPrices[0] * 100;
            returnPercent = returnPercent > 0 ? `+${returnPercent.toFixed(2)}` : returnPercent.toFixed(2);
            this.priceDataArr.push({
              ...priceData,
              chartData,
              chartLabels,
              returnPercent
            });
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
