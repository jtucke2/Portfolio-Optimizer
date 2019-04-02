import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { GlobalModule } from '../global/global.module';
import { PortfolioFormComponent } from './portfolio/portfolio-form/portfolio-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule, MatDatepickerModule, MatSelectModule, MatButtonModule, MatCardModule } from '@angular/material';
import { TickersComponent } from './portfolio/tickers/tickers.component';
import { DashboardService } from './dashboard.service';
import { ChartsModule } from 'ng2-charts';

@NgModule({
  declarations: [
    PortfolioComponent,
    PortfolioFormComponent,
    TickersComponent
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
    ChartsModule
  ],
  providers: [
    DashboardService
  ]
})
export class DashboardModule { }
