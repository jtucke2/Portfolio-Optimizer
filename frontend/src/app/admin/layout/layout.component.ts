import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  public navigations: any[] = [
    { url: 'manage-users', label: 'Manage Users' }
  ];

  constructor() { }

  ngOnInit() {
  }

}
