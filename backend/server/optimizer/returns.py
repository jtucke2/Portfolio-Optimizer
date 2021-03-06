from typing import List
import numpy as np
from scipy import stats

from server.optimizer.prep_data import AssetData


class PortfolioReturns(object):
    def __init__(self, asset_data: List[AssetData],
                 weights: np.ndarray = np.array([1.]), benchmark_data: AssetData = None):
        """Default value for weights assumes only a single asset is passed in

        :param asset_data:
        :param weights:
        :param benchmark_data:
        """
        self.weights = weights
        self.asset_prices_acs = self.generate_prices(asset_data)
        self.portfolio_prices = self.generate_portfolio_prices()
        self.portfolio_values = [sum(prices) for prices in self.portfolio_prices]
        self.portfolio_returns = AssetData.generate_returns(self.portfolio_values)
        self.total_return = (self.portfolio_values[0] - self.portfolio_values[-1]) / self.portfolio_values[-1]
        if benchmark_data:
            self.beta = self.calculate_beta(self.portfolio_returns, benchmark_data.returns)
            b_total_return = (benchmark_data.price_data[0] - benchmark_data.price_data[-1]) \
                / benchmark_data.price_data[-1]
            self.capm = self.calculate_capm(self.beta, b_total_return)
            self.alpha = self.calculate_alpha(self.total_return, self.capm)
        else:
            self.beta = None
            self.alpha = None
            self.capm = None

    def generate_portfolio_prices(self):
        long_prices = []
        # Calculate how many shares you would have with a $100 portfolio on day 1
        shares = [(w * 100) / p if w > 0 else 0 for w, p in zip(self.weights, self.asset_prices_acs[0])]
        for prices in self.asset_prices_acs:
            long_prices.append([s * p for s, p in zip(shares, prices)])

        # See if there are any short shares
        if sum(1 for x in self.weights if x < 0):
            short_prices = []
            short_shares = [(abs(w) * 100) / p if w < 0 else 0 for w, p in zip(self.weights, self.asset_prices_acs[0])]
            starting_prices = self.asset_prices_acs[0]
            for prices in self.asset_prices_acs:
                short_prices_row = []
                for i in range(0, len(prices)):
                    # Calculate short shares using inverse price movements
                    synthetic_short_price = starting_prices[i] + (starting_prices[i] - prices[i])
                    short_prices_row.append(short_shares[i] * synthetic_short_price)
                short_prices.append(short_prices_row)

            # Since short shares are calculated separated, need to merge them with long shares
            merged_prices = []
            for i in range(0, len(long_prices)):
                merged_prices_row = []
                for j in range(0, len(self.weights)):
                    weight = self.weights[j]
                    if weight == 0:
                        merged_prices_row.append(0)
                    elif weight > 0:
                        merged_prices_row.append(long_prices[i][j])
                    elif weight < 0:
                        merged_prices_row.append(short_prices[i][j])
                merged_prices.append(merged_prices_row)
            # Inverse to match dsc date ordering
            return merged_prices[::-1]
        else:
            # Inverse to match dsc date ordering
            return long_prices[::-1]

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

    @staticmethod
    def calculate_beta(p_returns: List[float], b_returns: List[float]) -> float:
        slope, *_ = stats.linregress(b_returns, p_returns)
        return float(slope)

    @staticmethod
    def calculate_capm(beta: float, b_tot_ret: float, risk_free_ret=0) -> float:
        return risk_free_ret + beta * (b_tot_ret - risk_free_ret)

    @staticmethod
    def calculate_alpha(p_tot_ret: float, capm: float) -> float:
        return p_tot_ret - capm

    def as_dict(self) -> dict:
        ret_val = {
            'portfolio_prices': self.portfolio_prices,
            'portfolio_values': self.portfolio_values,
            'portfolio_returns': self.portfolio_returns,
            'total_return': self.total_return
        }
        if self.alpha is not None:
            ret_val['alpha'] = self.alpha
        if self.beta is not None:
            ret_val['beta'] = self.beta
        if self.capm is not None:
            ret_val['capm'] = self.capm
        return ret_val
