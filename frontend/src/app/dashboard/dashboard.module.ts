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
import { ChartModule, HIGHCHARTS_MODULES } from 'angular-highcharts';
import { TickersComponent } from './portfolio/tickers/tickers.component';
import { DashboardService } from './dashboard.service';
import { ChartsModule } from 'ng2-charts';
import { OptimizationComponent } from './optimization/optimization.component';
import { JobListComponent } from './optimization/job-list/job-list.component';
import { JobViewerComponent } from './optimization/job-viewer/job-viewer.component';
import { SelectJobMsgComponent } from './optimization/select-job-msg/select-job-msg.component';
import { RouterModule } from '@angular/router';
import { AssetCardComponent } from './portfolio/asset-card/asset-card.component';
import ChartHelpers from '../global/helpers/chart-helpers';
import { ResultsDetailsComponent } from './optimization/job-viewer/results-details/results-details.component';

@NgModule({
  declarations: [
    PortfolioComponent,
    PortfolioFormComponent,
    TickersComponent,
    OptimizationComponent,
    JobListComponent,
    JobViewerComponent,
    SelectJobMsgComponent,
    AssetCardComponent,
    ResultsDetailsComponent
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
    { provide: HIGHCHARTS_MODULES, useFactory: () => ChartHelpers.highchartsProviders }
  ]
})
export class DashboardModule { }
