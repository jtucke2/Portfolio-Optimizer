import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DashboardService } from '../../dashboard.service';
import { IntervalEnum } from 'src/app/models/portfolio';
import { finalize } from 'rxjs/operators';
import { Prices } from 'src/app/models/price';
import { Color, BaseChartDirective, Label as ng2ChartLabel} from 'ng2-charts';
import { ChartDataSets, ChartOptions } from 'chart.js';

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

  public lineChartData: { [s: string]: ChartDataSets[] } = {};
  public lineChartLabels: { [s: string]: ng2ChartLabel[] } = {};
  public lineChartOptions: ChartOptions = {
    responsive: true,
    legend: {
      display: false
    },
    scales: {
      xAxes: [{
        display: false
      }],
      yAxes: [{
        // display: false
      }]
    }
  };
  public lineChartColors: Color[] = [
    {
      backgroundColor: 'rgba(233,30,99,0.2)',
      borderColor: '#E91E63',
      pointBackgroundColor: '#E91E63',
      pointBorderColor: '#fff',
      pointHoverBackgroundColor: '#fff',
      pointHoverBorderColor: '#E91E63'
    },
  ];

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
      const getPrices$ = this.dashboardService.getPrices(ticker, startDate, new Date(), IntervalEnum.MONTHLY)
        .subscribe(
          (priceData) => {
            const tickers = this.form.get('tickers').value;
            tickers.push(ticker);
            this.form.get('tickers').patchValue(tickers);
            this.tickerCtrl.reset();
            this.priceDataArr.push(priceData);
            this.lineChartData[ticker] = [{ data: priceData.prices.map(p => parseFloat(p.close as any).toFixed(2)), label: ticker }];
            this.lineChartLabels[ticker] = priceData.prices.map(p => p.date);
          },
          (err) => {
            console.log(err);
            this.errorMessage = `Unable to retrieve price data for ${ticker}.`;
          }
        );
    }
  }
}
