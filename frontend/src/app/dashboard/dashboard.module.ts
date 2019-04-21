import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { GlobalModule } from '../global/global.module';
import { PortfolioFormComponent } from './portfolio/portfolio-form/portfolio-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatInputModule,
  MatDatepickerModule,
  MatSelectModule,
  MatButtonModule,
  MatCardModule,
  MatTooltipModule,
  MatSidenavModule,
  MatListModule
} from '@angular/material';
import { TickersComponent } from './portfolio/tickers/tickers.component';
import { DashboardService } from './dashboard.service';
import { ChartsModule } from 'ng2-charts';
import { OptimizationComponent } from './optimization/optimization.component';
import { JobListComponent } from './optimization/job-list/job-list.component';
import { JobViewerComponent } from './optimization/job-viewer/job-viewer.component';
import { SelectJobMsgComponent } from './optimization/select-job-msg/select-job-msg.component';
import { RouterModule } from '@angular/router';
import { AssetCardComponent } from './portfolio/asset-card/asset-card.component';
import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import stock from 'highcharts/modules/stock.src';
import more from 'highcharts/highcharts-more.src';
import theme from 'highcharts/themes/dark-unica.src';

import { cyan, pink, blueGrey, grey } from 'material-colors';

function highChartsCustom(highchartsParam) {
  const extendedTheme = {
    ...highchartsParam.theme,
    rangeSelector: {
      selected: 4
    },
    // TODO add color gradients to globalVars
    colors: [
      pink['500'], blueGrey['400'], grey['300']
    ],
    chart: {
      ...highchartsParam.theme.chart,
      backgroundColor: 'rgba(0,0,0,0)',
      style: {
        fontFamily: '\'Rubik\', monospace'
      }
    }
  };
  highchartsParam.setOptions(extendedTheme);
  return highchartsParam;
}

@NgModule({
  declarations: [
    PortfolioComponent,
    PortfolioFormComponent,
    TickersComponent,
    OptimizationComponent,
    JobListComponent,
    JobViewerComponent,
    SelectJobMsgComponent,
    AssetCardComponent
  ],
  imports: [
    CommonModule,
    GlobalModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatDatepickerModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatTooltipModule,
    MatSidenavModule,
    MatListModule,
    ChartsModule,
    RouterModule,
    ChartModule
  ],
  providers: [
    DashboardService,
    { provide: HIGHCHARTS_MODULES, useFactory: () => [stock, more, theme, highChartsCustom] }
  ]
})
export class DashboardModule { }
