import pytest
from deepdiff import DeepDiff
import numpy as np
import json

from server.optimizer import prep_data, optimize
from server.optimizer.returns import PortfolioReturns

sample_tickers = ['IVV', 'GLD', 'QQQ', 'XLU', 'XLF', 'IHE', 'VIG', 'LQD']


def test_alpha_beta():
    b_data = prep_data.get_data('^GSPC', '2016-05-01', '2019-05-01', 'monthly')
    b_transformed_data, dates = prep_data.transform_yahoo_finance_dict(b_data)
    b_asset_data = prep_data.generate_asset_data_array(b_transformed_data)

    data = prep_data.get_data(['FB'], '2016-05-01', '2019-05-01', 'monthly')
    transformed_data, dates = prep_data.transform_yahoo_finance_dict(data)
    asset_data = prep_data.generate_asset_data_array(transformed_data)
    matrices = prep_data.AssetMatrices(asset_data)
    optimizer = optimize.Optimize(matrices, b_asset_data[0])
    results = optimizer.optimize_all()

    portfolio_returns = results[0].portfolio_returns
    assert len(portfolio_returns.portfolio_returns) == len(asset_data[0].returns)
    assert len(portfolio_returns.portfolio_values) == len(asset_data[0].price_data)

    portfolio_returns_dict = portfolio_returns.as_dict()
    assert portfolio_returns_dict['total_return'] > 0


def test_returns():
    data = prep_data.get_data(sample_tickers, '2018-05-01', '2019-02-01', 'weekly')
    transformed_data, dates = prep_data.transform_yahoo_finance_dict(data)
    asset_data = prep_data.generate_asset_data_array(transformed_data)
    matrices = prep_data.AssetMatrices(asset_data)
    optimizer = optimize.Optimize(matrices)
    results = optimizer.optimize_all()

    portfolio_returns = results[0].portfolio_returns
    assert len(portfolio_returns.portfolio_returns) == len(asset_data[0].returns)
    assert len(portfolio_returns.portfolio_values) == len(asset_data[0].price_data)

    portfolio_returns_dict = portfolio_returns.as_dict()
    assert portfolio_returns_dict['total_return'] > 0


def test_returns_s_and_p_500():
    data = prep_data.get_data('^GSPC', '2018-05-01', '2019-02-01', 'weekly')
    transformed_data, dates = prep_data.transform_yahoo_finance_dict(data)
    asset_data = prep_data.generate_asset_data_array(transformed_data)
    portfolio_returns = PortfolioReturns(asset_data)
    assert len(portfolio_returns.portfolio_returns) == len(asset_data[0].returns)
    assert len(portfolio_returns.portfolio_values) == len(asset_data[0].price_data)
