import { Injectable } from '@angular/core';
import { ApiService } from '../global/services/api.service';
import { IntervalEnum } from '../models/portfolio';
import { Observable } from 'rxjs';
import { Prices, AssetData } from '../models/price';
import { OptimizeJob } from '../models/optimize';

@Injectable()
export class DashboardService {
  private pricesUrl = '/api/prices/';
  private optimizeUrl = '/api/optimize';

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

  // This route is way too slow for the time being
  // public getAssetData(tickerSymbol: string): Observable<AssetData> {
  //   return this.api.get(`${this.pricesUrl}/asset-data/${tickerSymbol}`);
  // }

  public submitJob(jobData: OptimizeJob): Observable<{ task_id: string }> {
    const updatedJobDate = {
      ...jobData,
      start_date: jobData.start_date.toISOString().split('T')[0],
      end_date: jobData.end_date.toISOString().split('T')[0]
    };
    return this.api.post(`${this.optimizeUrl}/submit-job`, updatedJobDate);
  }
}
