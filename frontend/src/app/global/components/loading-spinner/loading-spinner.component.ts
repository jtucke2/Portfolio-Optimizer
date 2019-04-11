import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'loading-spinner',
  templateUrl: './loading-spinner.component.html',
  styleUrls: ['./loading-spinner.component.scss']
})
export class LoadingSpinnerComponent implements OnInit {
  @Input() public height = '100vh';

  constructor() { }

  ngOnInit() {
  }

}
