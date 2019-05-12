import { Portfolio } from './portfolio';

export interface BasicApiResponse {
    success: boolean;
    message?: string;
}

export interface PortfolioApiResponse extends BasicApiResponse {
    portfolio?: Portfolio;
}
