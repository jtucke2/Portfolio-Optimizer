import pytest
from deepdiff import DeepDiff
import numpy as np
import json

from server.optimizer import prep_data, optimize
from server.optimizer.returns import PortfolioReturns

sample_tickers = ['IVV', 'GLD', 'QQQ', 'XLU', 'XLF', 'IHE', 'VIG', 'LQD']


def test_short_returns_complex():
    b_data = prep_data.get_data('^GSPC', '2018-05-13', '2019-05-13', 'weekly')
    b_transformed_data, dates = prep_data.transform_yahoo_finance_dict(b_data)
    b_asset_data = prep_data.generate_asset_data_array(b_transformed_data)

    data = prep_data.get_data(['MSFT', 'X', 'AA', 'SPLK'], '2018-05-13', '2019-05-13', 'weekly')
    transformed_data, dates = prep_data.transform_yahoo_finance_dict(data)
    asset_data = prep_data.generate_asset_data_array(transformed_data)

    long_p_ret = PortfolioReturns(asset_data, np.array([1., 0., 0., 0.]), b_asset_data[0])
    long_short_p_ret = PortfolioReturns(asset_data, np.array([1., -0.3847, -0.3808, 0.7655]), b_asset_data[0])
    assert 1 == 1


def test_short_returns():
    b_data = prep_data.get_data('^GSPC', '2018-05-01', '2019-05-01', 'monthly')
    b_transformed_data, dates = prep_data.transform_yahoo_finance_dict(b_data)
    b_asset_data = prep_data.generate_asset_data_array(b_transformed_data)

    # MSFT is a winner, X is a loser during this period
    data = prep_data.get_data(['MSFT', 'X'], '2018-05-01', '2019-05-01', 'monthly')
    transformed_data, dates = prep_data.transform_yahoo_finance_dict(data)
    asset_data = prep_data.generate_asset_data_array(transformed_data)

    msft_start = asset_data[0].price_data[-1]
    msft_end = asset_data[0].price_data[0]
    msft_ret = (msft_end - msft_start) / msft_start
    x_start = asset_data[1].price_data[-1]
    x_end = asset_data[1].price_data[0]
    x_ret = (x_end - x_start) / x_start

    # Calculate long only returns
    long_p_ret = PortfolioReturns(asset_data, np.array([0.5, 0.5]), b_asset_data[0])
    expected_return = (msft_ret + x_ret) / 2
    assert round(long_p_ret.total_return, 3) == round(expected_return, 3)

    # Calculate long / short returns
    long_short_p_ret = PortfolioReturns(asset_data, np.array([0.5, -0.5]), b_asset_data[0])
    expected_return = (msft_ret - x_ret) / 2
    assert round(long_short_p_ret.total_return, 3) == round(expected_return, 3)


def test_alpha_beta():
    b_data = prep_data.get_data('^GSPC', '2016-05-01', '2019-05-01', 'monthly')
    b_transformed_data, dates = prep_data.transform_yahoo_finance_dict(b_data)
    b_asset_data = prep_data.generate_asset_data_array(b_transformed_data)

    data = prep_data.get_data(['FB', 'MSFT'], '2016-05-01', '2019-05-01', 'monthly')
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
