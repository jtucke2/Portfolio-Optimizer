from typing import List
from math import sqrt
import numpy as np
from scipy.optimize import minimize, OptimizeResult
from functools import reduce
from dataclasses import dataclass
from json import loads as json_loads

from server.optimizer.prep_data import AssetMatrices


@dataclass
class OptimizeOutcome:
    goal: str
    shorting_ok: bool
    weights: np.ndarray
    returns: np.ndarray
    std_dev: float
    sharpe_ratio: float
    optimize_result: OptimizeResult

    def as_json(self):
        return json_loads({
            'goal': self.goal,
            'weights': self.weights,
            'returns': self.returns,
            'std_dev': self.std_dev,
            'sharpe_ratio': self.sharpe_ratio
        })


class Optimize(object):
    weights_equal_1_constraint = {
        'type': 'eq',
        'fun': lambda arr: reduce(lambda acc, cur: acc + cur, arr) - 1
    }

    def __init__(self, asset_matrices: AssetMatrices):
        self.asset_matrices = asset_matrices
        self.long_only_bnds = [[0, 1] for x in asset_matrices.asset_data]
        self.short_ok_bnds = [[-1, 1] for x in asset_matrices.asset_data]
        self.equal_weights = np.array([1 / len(asset_matrices.asset_data)] * len(asset_matrices.asset_data))

    @staticmethod
    def calculate_returns(weights_vec: np.ndarray, avg_returns_vec: np.ndarray) -> np.ndarray:
        """Dot product of weight and return vectors

        :param weights_vec: np.ndarray
        :param returns_vec: np.ndarray
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

        returns = self.calculate_returns(optimize_result.x, self.asset_matrices.avg_returns_vec)
        std_dev = self.calculate_std_dev(optimize_result.x, self.asset_matrices.variance_covariance_matrix)
        sharpe_ratio = returns / std_dev

        return OptimizeOutcome('max-sharpe', shorting_allowed, optimize_result.x, returns, std_dev, sharpe_ratio, optimize_result)

    def optimize_all(self) -> List[OptimizeOutcome]:
        return [
            self.generate_max_sharpe_ratio(),
            self.generate_max_sharpe_ratio(True)
        ]



