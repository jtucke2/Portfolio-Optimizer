from typing import List
import numpy as np

from server.optimizer.prep_data import AssetData


class PortfolioReturns(object):
    def __init__(self, asset_data: List[AssetData], weights: np.ndarray = np.array([1.])):
        """Default value for weights assumes only a single asset is passed in

        :param asset_data:
        :param weights:
        """
        self.weights = weights
        self.asset_prices_acs = self.generate_prices(asset_data)
        self.portfolio_prices = self.generate_portfolio_prices()
        self.portfolio_values = [sum(prices) for prices in self.portfolio_prices]
        self.portfolio_returns = AssetData.generate_returns(self.portfolio_values)
        self.total_return = (self.portfolio_values[0] - self.portfolio_values[-1]) / self.portfolio_values[-1]

    def generate_portfolio_prices(self):
        ret_val = []
        # Calculate how many shares you would have with a $100 portfolio on day 1
        shares = [(w * 100) / p if w > 0 else 0 for w, p in zip(self.weights, self.asset_prices_acs[0])]
        for prices in self.asset_prices_acs:
            ret_val.append([s * p for s, p in zip(shares, prices)])

        # Inverse to match dsc date ordering
        return ret_val[::-1]

    @staticmethod
    def generate_prices(asset_data: List[AssetData]) -> List[List[float]]:
        """Returns inverse of price data by day, with assets for all prices

        :param asset_data:
        :return:
        """
        ret_val = []
        for i in range(0, len(asset_data[0].price_data)):
            ret_val.append([dat.price_data[i] for dat in asset_data])
        return ret_val[::-1]

    def as_dict(self) -> dict:
        return {
            'portfolio_prices': self.portfolio_prices,
            'portfolio_values': self.portfolio_values,
            'portfolio_returns': self.portfolio_returns,
            'total_return': self.total_return
        }
