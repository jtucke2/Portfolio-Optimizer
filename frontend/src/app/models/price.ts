export interface Price {
    date: string;
    close: number;
}

export interface Prices {
    prices: Price[];
    ticker: string;
}

export interface AssetData {
    ticker: string;
    quote_type_data: object;
    key_stats?: object;
}
