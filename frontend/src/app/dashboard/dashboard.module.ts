import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { GlobalModule } from '../global/global.module';

@NgModule({
  declarations: [PortfolioComponent],
  imports: [
    CommonModule,
    GlobalModule
  ]
})
export class DashboardModule { }
