import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject, ReplaySubject } from 'rxjs';

import { ApiService } from '../global/services/api.service';
import { IntervalEnum, Portfolio, PortfolioTask, CeleryTask } from '../models/portfolio';
import { Prices } from '../models/price';
import { OptimizeJob } from '../models/optimize';
import { CeleryState } from '../models/celery';

export interface CheckJobReturn {
  found: boolean;
  task: CeleryTask;
  result: Portfolio | null;
  message: string;
}

export interface ListBadge {
  [s: string]: {
    message: string;
    type: 'primary' | 'secondary' | 'info' | 'success';
  };
}

@Injectable()
export class DashboardService {
  public sidenavOpened = true;
  public sidenavOpened$: BehaviorSubject<boolean> = new BehaviorSubject(this.sidenavOpened);
  public portfolioTasks: PortfolioTask[] = [];
  public listBadge: ListBadge = {};
  public runPoller$ = new Subject();
  public retrievePortfolios$ = new BehaviorSubject<Partial<Portfolio>>(null);
  private pricesUrl = '/api/prices/';
  private optimizeUrl = '/api/optimize/';

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
    return this.api.post(`${this.optimizeUrl}submit-job`, updatedJobDate);
  }

  public getPortfolios(): Observable<Partial<Portfolio>[]> {
    return this.api.get(`${this.optimizeUrl}portfolio`);
  }

  public getPortfolioById(id: string): Observable<Portfolio> {
    return this.api.get(`${this.optimizeUrl}portfolio/${id}`);
  }

  public checkJobs(task_ids: string): Observable<CheckJobReturn[]> {
    return this.api.get(`${this.optimizeUrl}check-job/${task_ids}`);
  }

  public toggleSidenav() {
    this.sidenavOpened = !this.sidenavOpened;
    this.sidenavOpened$.next(this.sidenavOpened);
  }
}
