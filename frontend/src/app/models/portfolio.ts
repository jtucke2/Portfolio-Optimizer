import { CeleryState } from './celery';

export enum IntervalEnum {
    DAILY = 'daily',
    WEEKLY = 'weekly',
    MONTHLY = 'monthly'
}

export const Intervals = [IntervalEnum.DAILY, IntervalEnum.WEEKLY, IntervalEnum.MONTHLY];

export interface PortfolioTask {
    task_id: string;
    name: string;
    state: CeleryState;
    result_id?: string;
}

export interface CeleryTask {
    _id: string;
    status: CeleryState;
    result: string;
    date_done: {
        $date: number
    };
    traceback: string;
    children: string;
}

export interface Portfolio {
    name: string;
    _id: string;
    task_id: string;
    user_id: string;
    published: boolean;
    job_start: {
        $date: number
    };
    job_end: {
        $date: number
    };
    price_dates: string[];
    parameters: {
        start_date: string;
        end_date: string;
        interval: IntervalEnum;
        tickers: string[]
    };
    benchmark_index: BenchmarkIndex;
    asset_data: AssetData[];
    matrices: Matricies;
    results: OptimizationResult[];
}

export interface AssetData {
    avg_return: number;
    price_data: number[];
    std_dev: number;
    ticker: string;
}

export interface BenchmarkIndex {
    asset_data: AssetData;
    returns: PortfolioReturns;
}

export interface Matricies {
    avg_returns_vec: number[];
    n: number;
    std_dev_vec: number[];
    returns_matrix: number[][];
    std_dev_matrix_matrix: number[][];
    x_transpose_x_matrix: number[][];
    variance_covariance_matrix: number[][];
    std_dev_matrix: number[][];
    correlation_matrix: number[][];
}

export interface PortfolioReturns {
    portfolio_prices: number[];
    portfolio_values: number[];
    portfolio_returns: number[];
    total_return: number;
    alpha?: number;
    beta?: number;
    capm?: number;
}

export enum OptimizeGoal {
    MAX_SHARPE = 'Maximum Sharpe Ratio',
    MAX_RETURNS = 'Maximum Returns',
    MIN_STD_DEV = 'Minimum Standard Deviation',
    EQUAL_WEIGHT = 'Equal Weights'
}

export interface OptimizationResult {
    goal: OptimizeGoal;
    description?: string;
    returns: number;
    sharpe_ratio: number;
    shorting_ok: boolean;
    std_dev: number;
    weights: number[];
    portfolio_returns: PortfolioReturns;
}
