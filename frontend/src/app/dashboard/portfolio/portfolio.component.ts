import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit {
  public form = new FormGroup({
    start_date: new FormControl(null, Validators.required),
    end_date: new FormControl(new Date(), Validators.required),
    interval: new FormControl('weekly', Validators.required),
    tickers: new FormControl([], Validators.required)
  });

  constructor() { }

  ngOnInit() {
    const lastYear = new Date();
    lastYear.setFullYear(lastYear.getFullYear() - 1);
    this.form.get('start_date').patchValue(lastYear);
  }

}
