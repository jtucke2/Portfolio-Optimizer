from typing import List, Union
from math import sqrt
import numpy as np
from scipy.optimize import minimize, OptimizeResult
from functools import reduce
from dataclasses import dataclass
from typing import Optional
from enum import Enum

from server.optimizer.prep_data import AssetMatrices
from server.optimizer.returns import PortfolioReturns


class OptimizeGoal(Enum):
    MAX_SHARPE = 'Maximum Sharpe Ratio'
    MAX_RETURNS = 'Maximum Returns'
    MIN_STD_DEV = 'Minimum Standard Deviation'
    EQUAL_WEIGHT = 'Equal Weights'


@dataclass
class OptimizeOutcome:
    goal: OptimizeGoal
    shorting_ok: bool
    weights: Union[np.ndarray, List[float]]
    returns: Union[np.ndarray, float]
    std_dev: float
    sharpe_ratio: float
    optimize_result: Optional[OptimizeResult]
    portfolio_returns: PortfolioReturns

    def as_dict(self):
        return {
            'goal': self.goal.value,
            'description': self.get_goal_description(),
            'shorting_ok': self.shorting_ok,
            'weights': self.weights.tolist() if type(self.weights) == np.ndarray else self.weights,
            'returns': self.returns.tolist()[0] if type(self.returns) == np.ndarray else self.returns,
            'std_dev': self.std_dev,
            'sharpe_ratio': self.sharpe_ratio,
            'portfolio_returns': self.portfolio_returns.as_dict()
        }

    def get_goal_description(self) -> str:
        ret_val = 'This strategy '
        if self.goal == OptimizeGoal.MAX_SHARPE:
            ret_val += 'will optimize the portfolio\'s Sharpe Ratio, ' + \
                'finding the highest ratio of the portfolio\'s average returns to standard deviation of returns.'
        elif self.goal == OptimizeGoal.MAX_RETURNS:
            ret_val += 'will maximize the portfolio\'s returns while keeping the standard deviation of the ' + \
                       'portfolio at or below the standard deviation of the least volatile asset in the portfolio. ' + \
                       'If this is not possible, the least volatile asset will be weighed at 100%.'
        elif self.goal == OptimizeGoal.MIN_STD_DEV:
            ret_val += 'will minimize the portfolio\'s standard deviation of returns while keeping the portfolio\'s ' + \
                       'overall return at or above the returns of the highest returning asset in the ' + \
                       'portfolio.  If this is not possible, and the highest returning asset will be ' + \
                       'weighed at 100%.'
        elif self.goal == OptimizeGoal.EQUAL_WEIGHT:
            ret_val += 'will place equal weights on all assets.  This included for a benchmark to compare the ' + \
                'optimized portfolios against.'

        if self.shorting_ok:
            ret_val += '  This portfolio uses a long/short strategy, where asset weights can ' + \
                'either be positive (long) or negative (short), with a bias towards long positions ' + \
                'as all weights must equal 1.'
        else:
            ret_val += '  This portfolio uses a long only strategy, where asset weights can only be positive (long.)'

        return ret_val


class Optimize(object):
    equal_weights_outcome: OptimizeOutcome
    weights_equal_1_constraint = {
        'type': 'eq',
        'fun': lambda arr: reduce(lambda acc, cur: acc + cur, arr) - 1
    }

    def __init__(self, asset_matrices: AssetMatrices):
        self.asset_matrices = asset_matrices

        # Bounds for optimizer must match length of data
        self.long_only_bnds = [[0, 1] for x in asset_matrices.asset_data]
        self.short_ok_bnds = [[-1, 1] for x in asset_matrices.asset_data]

        # Generate equal returns data as a baseline
        self.equal_weights = np.array([1 / len(asset_matrices.asset_data)] * len(asset_matrices.asset_data))
        equal_weights_results = self.process_weights(self.equal_weights)
        equal_weights_returns = PortfolioReturns(self.asset_matrices.asset_data, self.equal_weights)
        self.equal_weights_outcome = OptimizeOutcome(OptimizeGoal.EQUAL_WEIGHT, False, self.equal_weights,
                                                     equal_weights_results['returns'], equal_weights_results['std_dev'],
                                                     equal_weights_results['sharpe_ratio'], None, equal_weights_returns)

        self.min_std_dev = np.min(asset_matrices.std_dev_vec)
        # The standard deviation must be <= the lowest standard deviation of any assets
        self.std_dev_lte_min_constraint = {
            'type': 'ineq',
            'fun': lambda arr: self.min_std_dev - self.calculate_std_dev(arr,
                                                                         self.asset_matrices.variance_covariance_matrix)
        }

        self.max_returns = np.max(asset_matrices.avg_returns_vec)
        # The rate of return must be greater than the rate of return for any asset
        self.returns_gte_max_constraint = {
            'type': 'ineq',
            'fun': lambda arr: self.calculate_returns(arr, self.asset_matrices.avg_returns_vec) - self.max_returns
        }

    @staticmethod
    def calculate_returns(weights_vec: np.ndarray, avg_returns_vec: np.ndarray) -> np.ndarray:
        """Dot product of weight and return vectors

        :param weights_vec: np.ndarray
        :param avg_returns_vec: np.ndarray
        :return:
        """
        return np.dot(weights_vec, avg_returns_vec)

    @staticmethod
    def calculate_std_dev(weights_vec: np.ndarray, variance_covariance_matrix: np.ndarray) -> float:
        """Square root of 1 x 1 matrix of standard deviations

        :param weights_vec:
        :param variance_covariance_matrix:
        :return:
        """
        inner_matrix = np.matmul(weights_vec, variance_covariance_matrix)
        outer_matrix = np.matmul(inner_matrix, weights_vec)
        return sqrt(outer_matrix)

    def process_weights(self, weights: Union[np.ndarray, List[float]]) -> dict:
        returns = self.calculate_returns(weights, self.asset_matrices.avg_returns_vec)
        std_dev = self.calculate_std_dev(weights, self.asset_matrices.variance_covariance_matrix)
        return {
            'returns': returns,
            'std_dev': std_dev,
            'sharpe_ratio': returns / std_dev
        }

    def generate_max_sharpe_ratio(self, shorting_allowed=False) -> OptimizeOutcome:
        def max_sharpe_fn(weights_vec: np.ndarray):
            ret = self.calculate_returns(weights_vec, self.asset_matrices.avg_returns_vec)
            std_dev = self.calculate_std_dev(weights_vec, self.asset_matrices.variance_covariance_matrix)
            return (ret / std_dev) * -1

        bnds = self.short_ok_bnds if shorting_allowed else self.long_only_bnds

        optimize_result: OptimizeResult = minimize(
            max_sharpe_fn,
            self.equal_weights,
            method='SLSQP',
            bounds=bnds,
            constraints=[self.weights_equal_1_constraint]
        )

        pw = self.process_weights(optimize_result.x)
        portfolio_returns = PortfolioReturns(self.asset_matrices.asset_data, optimize_result.x)

        return OptimizeOutcome(OptimizeGoal.MAX_SHARPE, shorting_allowed, optimize_result.x,
                               pw['returns'], pw['std_dev'], pw['sharpe_ratio'], optimize_result, portfolio_returns)

    def generate_max_returns(self, shorting_allowed=False) -> OptimizeOutcome:
        def max_returns_fn(weights_vec: np.ndarray):
            return self.calculate_returns(weights_vec, self.asset_matrices.avg_returns_vec) * -1

        bnds = self.short_ok_bnds if shorting_allowed else self.long_only_bnds

        optimize_result: OptimizeResult = minimize(
            max_returns_fn,
            self.equal_weights,
            method='SLSQP',
            bounds=bnds,
            constraints=[self.weights_equal_1_constraint, self.std_dev_lte_min_constraint]
        )

        pw = self.process_weights(optimize_result.x)
        portfolio_returns = PortfolioReturns(self.asset_matrices.asset_data, optimize_result.x)

        return OptimizeOutcome(OptimizeGoal.MAX_RETURNS, shorting_allowed, optimize_result.x,
                               pw['returns'], pw['std_dev'], pw['sharpe_ratio'], optimize_result, portfolio_returns)

    def generate_min_std_dev(self, shorting_allowed=False) -> OptimizeOutcome:
        def min_std_dev_fn(weights_vec: np.ndarray):
            return self.calculate_std_dev(weights_vec, self.asset_matrices.variance_covariance_matrix)

        bnds = self.short_ok_bnds if shorting_allowed else self.long_only_bnds

        optimize_result: OptimizeResult = minimize(
            min_std_dev_fn,
            self.equal_weights,
            method='SLSQP',
            bounds=bnds,
            constraints=[self.weights_equal_1_constraint, self.returns_gte_max_constraint]
        )

        pw = self.process_weights(optimize_result.x)
        portfolio_returns = PortfolioReturns(self.asset_matrices.asset_data, optimize_result.x)

        return OptimizeOutcome(OptimizeGoal.MIN_STD_DEV, shorting_allowed, optimize_result.x,
                               pw['returns'], pw['std_dev'], pw['sharpe_ratio'], optimize_result, portfolio_returns)

    def optimize_all(self) -> List[OptimizeOutcome]:
        return [
            self.generate_max_sharpe_ratio(),
            self.generate_max_sharpe_ratio(True),
            self.generate_max_returns(),
            self.generate_max_returns(True),
            self.generate_min_std_dev(),
            self.generate_min_std_dev(True),
            self.equal_weights_outcome
        ]
