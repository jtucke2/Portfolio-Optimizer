import pytest
from deepdiff import DeepDiff
import numpy as np
import json

from server.optimizer import prep_data, optimize
from server.optimizer.returns import PortfolioReturns

sample_tickers = ['IVV', 'GLD', 'QQQ', 'XLU', 'XLF', 'IHE', 'VIG', 'LQD']


def test_returns():
    data = prep_data.get_data(sample_tickers, '2018-05-01', '2019-02-01', 'weekly')
    transformed_data, dates = prep_data.transform_yahoo_finance_dict(data)
    asset_data = prep_data.generate_asset_data_array(transformed_data)
    matrices = prep_data.AssetMatrices(asset_data)
    optimizer = optimize.Optimize(matrices)
    results = optimizer.optimize_all()
    portfolio_returns = PortfolioReturns(results[0].weights, asset_data)
    # TODO do a test


def test_returns_s_and_p():
    data = prep_data.get_data('^GSPC', '2018-05-01', '2019-02-01', 'weekly')
    transformed_data, dates = prep_data.transform_yahoo_finance_dict(data)
    asset_data = prep_data.generate_asset_data_array(transformed_data)
    portfolio_returns = PortfolioReturns(np.array([1.]), asset_data)
    # TODO do a test
