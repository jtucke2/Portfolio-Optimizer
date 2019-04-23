import { Component, OnInit, Input } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';
import { StockChart } from 'angular-highcharts';

import { OptimizationResult, BenchmarkIndex } from 'src/app/models/portfolio';
import { map } from 'rxjs/operators';
import ChartHelpers from 'src/app/global/helpers/chart-helpers';
import { globalVars } from 'src/app/global/global-vars';

@Component({
  selector: 'results-details',
  templateUrl: './results-details.component.html',
  styleUrls: ['./results-details.component.scss']
})
export class ResultsDetailsComponent implements OnInit {
  @Input() public optimizationResult$: ReplaySubject<OptimizationResult>;
  @Input() public benchmarkIndex: BenchmarkIndex;
  @Input() public priceDates: string[];

  public comparisonChart$: Observable<StockChart>;

  constructor() { }

  ngOnInit() {
    this.comparisonChart$ = this.optimizationResult$
      .pipe(
        map((opt) => new StockChart({
          colors: globalVars.COLOR_SCALES.COMPARISON,
          legend: {
            enabled: true
          },
          plotOptions: {
            series: {
              compare: 'percent',
              showInNavigator: true
            }
          },
          tooltip: ChartHelpers.percentTooltip,
          series: [
            ChartHelpers.portfolioReturnsToSeries(
              `${opt.goal} ${opt.shorting_ok ? '(Long/Short)' : ''}`,
              this.priceDates, opt.portfolio_returns
            )
            // TODO add comparison indicies
          ]
        }))
      );
  }

}
