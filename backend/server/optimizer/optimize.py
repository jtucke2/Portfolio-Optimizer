from typing import List, Union
from math import sqrt
import numpy as np
from scipy.optimize import minimize, OptimizeResult
from functools import reduce
from dataclasses import dataclass
from json import loads as json_loads
from enum import Enum

from server.optimizer.prep_data import AssetMatrices


class OptimizeGoal(Enum):
    MAX_SHARPE = 'Maximum Sharpe Ratio'
    MAX_RETURNS = 'Maximum Returns'
    MIN_STD_DEV = 'Minimum Standard Deviation'


@dataclass
class OptimizeOutcome:
    goal: OptimizeGoal
    shorting_ok: bool
    weights: Union[np.ndarray, List[float]]
    returns: Union[np.ndarray, float]
    std_dev: float
    sharpe_ratio: float
    optimize_result: OptimizeResult

    def as_dict(self):
        return {
            'goal': self.goal.value,
            'shorting_ok': self.shorting_ok,
            'weights': self.weights.tolist() if type(self.weights) == np.ndarray else self.weights,
            'returns': self.returns.tolist()[0] if type(self.returns) == np.ndarray else self.returns,
            'std_dev': self.std_dev,
            'sharpe_ratio': self.sharpe_ratio
        }


class Optimize(object):
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
        self.equal_weights_results = self.process_weights(self.equal_weights)

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

        return OptimizeOutcome(OptimizeGoal.MAX_SHARPE, shorting_allowed, optimize_result.x,
                               pw['returns'], pw['std_dev'], pw['sharpe_ratio'], optimize_result)

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

        return OptimizeOutcome(OptimizeGoal.MAX_RETURNS, shorting_allowed, optimize_result.x,
                               pw['returns'], pw['std_dev'], pw['sharpe_ratio'], optimize_result)

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

        return OptimizeOutcome(OptimizeGoal.MIN_STD_DEV, shorting_allowed, optimize_result.x,
                               pw['returns'], pw['std_dev'], pw['sharpe_ratio'], optimize_result)

    def optimize_all(self) -> List[OptimizeOutcome]:
        # TODO add equal weight to this return
        return [
            self.generate_max_sharpe_ratio(),
            self.generate_max_sharpe_ratio(True),
            self.generate_max_returns(),
            self.generate_max_returns(True),
            self.generate_min_std_dev(),
            self.generate_min_std_dev(True)
        ]
