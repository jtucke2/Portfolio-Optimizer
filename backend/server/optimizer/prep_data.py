from typing import Dict, List
import numpy as np


class AssetData(object):
    """Based on the asset ticker and price data, generate the following:

    - List of rate of returns
    - Standard deviation of returns
    - Average rate of return
    """

    def __init__(self, ticker: str, price_data: List[float]):
        """n/a

        :param ticker:
        :param price_data:
        """
        self.ticker = ticker
        self.price_data = price_data
        self.returns = self.generate_returns(price_data)
        self.std_dev = np.std(self.returns)
        self.avg_return = np.average(self.returns)

    @staticmethod
    def generate_returns(prices: List[float]) -> List[float]:
        """Generates a list of rates of returns using natural log
        from a list of asset prices

        :param prices: List[float]
        :return:
        :rtype: List[float]
        """
        ret_val = []
        for i in range(0, len(prices) - 1):
            ret_val.append(np.log(prices[i] / prices[i + 1]))
        return ret_val


class AssetMatrices(object):
    def __init__(self, asset_data: List[AssetData]):
        pass


def transform_yahoo_finance_dict(historical_prices) -> Dict[str, List[float]]:
    ret_val = {}
    for ticker, data in historical_prices.items():
        ret_val[ticker] = [price['close'] for price in data['prices']]
    return ret_val


def generate_asset_data_array(price_dict: Dict[str, List[float]]) -> List[AssetData]:
    ret_val = []
    for ticker, price_data in price_dict.items():
        ret_val.append(AssetData(ticker, price_data))
    return ret_val
