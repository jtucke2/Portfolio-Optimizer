import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DashboardService } from '../../dashboard.service';
import { IntervalEnum } from 'src/app/models/portfolio';
import { finalize } from 'rxjs/operators';
import { Prices } from 'src/app/models/price';

@Component({
  selector: 'tickers',
  templateUrl: './tickers.component.html',
  styleUrls: ['./tickers.component.scss']
})
export class TickersComponent implements OnInit {
  @Input() public form: FormGroup;
  public tickerCtrl = new FormControl('', Validators.required);
  public errorMessage = '';
  public priceDataArr: Prices[] = [];

  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
  }

  tickerCtrlSubmit() {
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);
    const ticker = this.tickerCtrl.value.toUpperCase();
    if (this.form.get('tickers').value.includes(ticker)) {
      this.errorMessage = `${ticker} is already included in the portfolio.`;
    } else {
      const getPrices$ = this.dashboardService.getPrices(ticker, startDate, new Date(), IntervalEnum.WEEKLY)
        .subscribe(
          (priceData) => {
            const tickers = this.form.get('tickers').value;
            tickers.push(ticker);
            this.form.get('tickers').patchValue(tickers);
            this.tickerCtrl.reset();
            this.priceDataArr.push(priceData);
          },
          (err) => {
            console.log(err);
            this.errorMessage = `Unable to retrieve price data for ${ticker}.`;
          }
        );
    }
  }
}
