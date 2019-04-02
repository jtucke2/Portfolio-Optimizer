import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Intervals } from 'src/app/models/portfolio';

@Component({
  selector: 'portfolio-form',
  templateUrl: './portfolio-form.component.html',
  styleUrls: ['./portfolio-form.component.scss']
})
export class PortfolioFormComponent implements OnInit {
  @Input() public form: FormGroup;
  public intervals = Intervals;

  constructor() { }

  ngOnInit() {
  }

}
