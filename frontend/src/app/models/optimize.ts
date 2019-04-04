import { IntervalEnum } from './portfolio';

export interface OptimizeJob {
    name: string;
    tickers: string[];
    start_date: Date;
    end_date: Date;
    interval: IntervalEnum;
}
