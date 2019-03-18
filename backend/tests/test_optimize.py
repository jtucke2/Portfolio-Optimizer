import pytest
from yahoofinancials import YahooFinancials
from deepdiff import DeepDiff
import json

from server.optimizer import prep_data, optimize

sample_tickers = ['IVV', 'GLD', 'QQQ', 'XLU', 'XLF', 'IHE', 'VIG', 'LQD']


def get_data(tickers, start_date, end_date, interval='weekly'):
    yahoo_financials = YahooFinancials(tickers)
    historical_stock_prices = yahoo_financials.get_historical_price_data(start_date, end_date, interval)
    return historical_stock_prices


def test_optimize():
    data = get_data(sample_tickers, '2006-07-01', '2012-07-02', 'monthly')
    transformed_data = prep_data.transform_yahoo_finance_dict(data)
    asset_data = prep_data.generate_asset_data_array(transformed_data)
    matrices = prep_data.AssetMatrices(asset_data)
    optimizer = optimize.Optimize(matrices)
    results = optimizer.optimize_all()
    assert hasattr(matrices, 'correlation_matrix')
