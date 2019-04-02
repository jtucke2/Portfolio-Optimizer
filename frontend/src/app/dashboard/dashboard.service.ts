import { Injectable } from '@angular/core';
import { ApiService } from '../global/services/api.service';
import { IntervalEnum } from '../models/portfolio';
import { Observable } from 'rxjs';
import { Prices } from '../models/price';

@Injectable()
export class DashboardService {
  private pricesUrl = '/api/prices/';

  constructor(private api: ApiService) { }

  public getPrices(tickerSymbol: string, start_date: Date, end_date: Date, interval: IntervalEnum): Observable<Prices> {
    const dat = {
      ticker: tickerSymbol,
      start_date: start_date.toISOString().split('T')[0],
      end_date: end_date.toISOString().split('T')[0],
      interval
    };
    return this.api.post(this.pricesUrl, dat);
  }
}
