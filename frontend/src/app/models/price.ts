export interface Price {
    date: string;
    close: number;
}

export interface Prices {
    prices: Price[];
    ticker: string;
}
