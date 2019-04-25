import { Component, Input, Output, EventEmitter } from '@angular/core';

import { PricesExtended } from '../tickers/tickers.component';

@Component({
  selector: 'asset-card',
  templateUrl: './asset-card.component.html',
  styleUrls: ['./asset-card.component.scss']
})
export class AssetCardComponent {
  @Input() public priceData: PricesExtended;
  @Input() public removable = true;
  @Output() public removeAsset = new EventEmitter<string>();

  constructor() { }
}
