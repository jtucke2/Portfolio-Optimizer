import pytest
from deepdiff import DeepDiff
import numpy as np
import json

from server.optimizer import prep_data, optimize

sample_tickers = ['IVV', 'GLD', 'QQQ', 'XLU', 'XLF', 'IHE', 'VIG', 'LQD']


def test_optimize():
    data = prep_data.get_data(sample_tickers, '2006-07-01', '2012-08-01', 'monthly')
    transformed_data, dates = prep_data.transform_yahoo_finance_dict(data)
    asset_data = prep_data.generate_asset_data_array(transformed_data)
    matrices = prep_data.AssetMatrices(asset_data)
    optimizer = optimize.Optimize(matrices)
    results = optimizer.optimize_all()

    # Test max sharpe
    test_cases = [
        optimizer.equal_weights_results['sharpe_ratio'],
        *(opt.sharpe_ratio for opt in results if not opt.shorting_ok and opt.goal != optimize.OptimizeGoal.MAX_SHARPE)
    ]
    max_sharpe = [opt.sharpe_ratio for opt in results if not opt.shorting_ok and opt.goal == optimize.OptimizeGoal.MAX_SHARPE][0]
    for test_case in test_cases:
        assert max_sharpe > test_case

    # Test max returns
    max_returns = [opt.returns for opt in results if not opt.shorting_ok and opt.goal == optimize.OptimizeGoal.MAX_RETURNS][0]
    idx_of_min_std_dev = np.where(optimizer.asset_matrices.std_dev_vec == optimizer.min_std_dev)[0]
    assert ~idx_of_min_std_dev
    returns_of_min_asset = optimizer.asset_matrices.avg_returns_vec[idx_of_min_std_dev][0]
    assert max_returns >= returns_of_min_asset

    # Test min standard deviation
    min_std_dev = [opt.std_dev for opt in results if not opt.shorting_ok and opt.goal == optimize.OptimizeGoal.MIN_STD_DEV][0]
    idx_of_max_returns = np.where(optimizer.asset_matrices.avg_returns_vec == optimizer.max_returns)[0]
    assert ~idx_of_max_returns
    std_dev_of_max_returns_asset = optimizer.asset_matrices.std_dev_vec[idx_of_max_returns][0]
    # Add padding, this is due to "greater than" as opposed to "greater than or equal to" logic in the constraint
    std_dev_of_max_returns_asset = std_dev_of_max_returns_asset + 0.02
    assert min_std_dev <= std_dev_of_max_returns_asset
