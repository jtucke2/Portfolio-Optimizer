import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'page-title',
  templateUrl: './page-title.component.html',
  styleUrls: ['./page-title.component.scss']
})
export class PageTitleComponent implements OnInit {
  @Input() public title = '';
  @Input() public containerType: 'container' | 'container-fluid' | 'container-fluid paddedContainer' = 'container';

  constructor() { }

  ngOnInit() {
  }

}
