import pytest
from yahoofinancials import YahooFinancials
from deepdiff import DeepDiff
import json

from server.optimizer import prep_data

sample_tickers = ['AAPL', 'XOM', 'WMT', 'BAC']


def get_data(tickers, start_date, end_date, interval='weekly'):
    yahoo_financials = YahooFinancials(tickers)
    historical_stock_prices = yahoo_financials.get_historical_price_data(start_date, end_date, interval)
    return historical_stock_prices


def test_transform_yahoo_finance_dict():
    data = get_data(sample_tickers, '2018-12-01', '2019-01-01')
    transformed_data = prep_data.transform_yahoo_finance_dict(data)
    expected = {
        "AAPL": [178.5800018310547, 168.49000549316406, 165.47999572753906, 150.72999572753906, 156.22999572753906, 157.74000549316406],
        "XOM": [79.5, 77.63999938964844, 75.58000183105469, 68.12000274658203, 68.16999816894531, 68.19000244140625],
        "WMT": [97.6500015258789, 93.19000244140625, 91.8499984741211, 87.12999725341797, 92.12999725341797, 93.1500015258789],
        "BAC": [28.399999618530273, 25.43000030517578, 24.479999542236328, 23.3700008392334, 24.389999389648438, 24.639999389648438]
    }
    diff = DeepDiff(transformed_data, expected, ignore_order=True)
    assert len(diff.keys()) == 0


def test_asset_data():
    data = get_data('AAPL', '2012-01-01', '2019-01-01')
    transformed_data = prep_data.transform_yahoo_finance_dict(data)
    obj = prep_data.AssetData('AAPL', transformed_data['AAPL'])
    assert len(obj.price_data) - 1 == len(obj.returns)
    assert obj.avg_return == -0.0026326179612188244
    assert obj.std_dev == 0.03652151061032085

def test_generate_asset_data_array():
    data = get_data(sample_tickers, '2012-01-01', '2019-01-01')
    transformed_data = prep_data.transform_yahoo_finance_dict(data)
    asset_data = prep_data.generate_asset_data_array(transformed_data)
    assert 1 == 1
