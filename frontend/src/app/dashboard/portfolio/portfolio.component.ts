import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IntervalEnum } from 'src/app/models/portfolio';
import { DashboardService } from '../dashboard.service';

@Component({
  selector: 'portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit {
  public form = new FormGroup({
    name: new FormControl('', Validators.required),
    start_date: new FormControl(null, Validators.required),
    end_date: new FormControl(new Date(), Validators.required),
    interval: new FormControl(IntervalEnum.WEEKLY, Validators.required),
    tickers: new FormControl([], Validators.required)
  });

  constructor(private dashboardService: DashboardService) { }

  ngOnInit() {
    const lastYear = new Date();
    lastYear.setFullYear(lastYear.getFullYear() - 1);
    this.form.get('start_date').patchValue(lastYear);
  }

  onFormSubmit() {
    console.log('hi!');
    this.dashboardService.submitJob(this.form.value)
      .subscribe(
        (jobReturn) => {
          console.log(jobReturn);
        },
        (err) => {
          console.log(err);
        }
      );
  }

}
