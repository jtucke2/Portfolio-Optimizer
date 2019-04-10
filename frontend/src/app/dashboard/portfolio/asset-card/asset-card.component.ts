import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { PricesExtended } from '../tickers/tickers.component';
import { globalVars } from 'src/app/global/global-vars';
import { Color } from 'ng2-charts';
import { ChartOptions } from 'chart.js';

@Component({
  selector: 'asset-card',
  templateUrl: './asset-card.component.html',
  styleUrls: ['./asset-card.component.scss']
})
export class AssetCardComponent implements OnInit {
  @Input() public priceData: PricesExtended;
  @Input() public removable = true;
  @Output() public removeAsset = new EventEmitter<string>();

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
        gridLines: {
          color: '#616161'
        },
        ticks: {
          fontColor: '#bdbdbd',
          fontFamily: globalVars.FONT_FAMILY
        }
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

  constructor() { }

  ngOnInit() {
  }

}
