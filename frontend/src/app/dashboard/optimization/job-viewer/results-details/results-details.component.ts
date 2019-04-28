import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Observable, ReplaySubject, combineLatest, of as observableOf } from 'rxjs';
import { StockChart, Chart } from 'angular-highcharts';

import { OptimizationResult, BenchmarkIndex, OptimizeGoal } from 'src/app/models/portfolio';
import { map, switchMap, delay, share } from 'rxjs/operators';
import ChartHelpers from 'src/app/global/helpers/chart-helpers';
import { globalVars } from 'src/app/global/global-vars';
import { DashboardService } from 'src/app/dashboard/dashboard.service';

@Component({
  selector: 'results-details',
  templateUrl: './results-details.component.html',
  styleUrls: ['./results-details.component.scss']
})
export class ResultsDetailsComponent implements OnInit {
  @Input() public optimizationResult$: ReplaySubject<OptimizationResult>;
  @Input() public equalWeightResults$: ReplaySubject<OptimizationResult>;
  @Input() public benchmarkIndex: BenchmarkIndex;
  @Input() public priceDates: string[];
  @Input() public tickers: string[];
  @ViewChild('comparisonChartRef') public comparisonChartRef: ElementRef;

  public comparisonChart$: Observable<StockChart>;
  public volatilityChart$: Observable<StockChart>;
  public weightsChart$: Observable<Chart>;

  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
    // Reflow graphs after sidenav is opened/closed, wait for open/close to finish
    const sidenavOpened$ = this.dashboardService.sidenavOpened$
      .pipe(
        switchMap(() => observableOf(null).pipe(delay(300))),
        share()
      );

    this.comparisonChart$ = combineLatest(this.optimizationResult$, this.equalWeightResults$)
      .pipe(
        map(([opt, eqWeights]) => {
          const comparisonSeries = [];
          if (opt.goal !== OptimizeGoal.EQUAL_WEIGHT) {
            comparisonSeries.push(ChartHelpers.portfolioReturnsToSeries(eqWeights.goal, this.priceDates, eqWeights.portfolio_returns));
          }
          comparisonSeries.push(ChartHelpers.portfolioReturnsToSeries(
            globalVars.GET_BENCHMARK_NAME(this.benchmarkIndex.asset_data.ticker), this.priceDates, this.benchmarkIndex.returns
          ));
          return new StockChart({
            chart: {
              events: {
                load() {
                  sidenavOpened$.subscribe(() => Object.keys(this).length && this.reflow());
                }
              }
            },
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
                this.priceDates,
                opt.portfolio_returns
              ),
              ...comparisonSeries
            ]
          });
        })
      );

    this.volatilityChart$ = this.optimizationResult$
      .pipe(
        map((opt) => {
          const name = `${opt.goal} ${opt.shorting_ok ? '(Long/Short)' : ''}`;
          return new StockChart({
            chart: {
              events: {
                load() {
                  sidenavOpened$.subscribe(() => Object.keys(this).length && this.reflow());
                }
              }
            },
            colors: globalVars.COLOR_SCALES.COMPARISON,
            legend: {
              enabled: true
            },
            series: [
              ChartHelpers.portfolioReturnsToSeries(
                name,
                this.priceDates,
                opt.portfolio_returns
              ),
              {
                type: 'bb',
                name: 'Bollinger Bands',
                linkedTo: name
              }
            ]
          });
        })
      );

    this.weightsChart$ = this.optimizationResult$
        .pipe(
          map(opt => {
            const prefixFn = (x: number) => x < 0 ? '-' : opt.shorting_ok ? '+' : '';
            return new Chart({
              chart: {
                events: {
                  load() {
                    sidenavOpened$.subscribe(() => Object.keys(this).length && this.reflow());
                  }
                },
                type: 'pie'
              },
              series: [
                {
                  name: 'Weights',
                  type: null,
                  data: opt.weights
                    .map((w, i) => ({
                      name: `${prefixFn(w)}${this.tickers[i]}`,
                      y: Math.abs(w) * 100,
                      prefix: prefixFn(w)
                    }))
                    .filter(({y}) => y > 0.001)
                }
              ],
              title: {
                text: ''
              },
              tooltip: {
                pointFormat: '<span style="color:{series.color}">{series.name}</span>: {point.prefix}{point.y}%',
                valueDecimals: 2
              }
            });
          })
        );

  }

}
