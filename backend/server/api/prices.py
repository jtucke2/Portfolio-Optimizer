from datetime import datetime, timedelta
import enum

from dateutil import parser as dateparser
from flask_restplus import Namespace, Resource, fields
from flask import request
from yahoofinancials import YahooFinancials


class PriceIntervalEnum(enum.Enum):
    daily = 'daily'
    weekly = 'weekly'
    monthly = 'monthly'


api = Namespace('prices', description='Handles retrieval of asset prices')

asset_returns = api.model('Asset Returns', {
    'prices': fields.List(
        fields.Nested(
            api.model(
                'price',
                {'date': fields.String(required=True), 'close': fields.String(required=True)}
            )
        )
    ),
    'ticker': fields.String(required=True)
})

asset_price_request = api.model('Asset Price Request', {
    'ticker': fields.String(required=True),
    'start_date': fields.String(required=True,
                                description='',
                                default=datetime.today().strftime('%Y-%m-%d')),
    'end_date': fields.String(required=True,
                              description='Zero padded time',
                              default=(datetime.today() - timedelta(7)).strftime('%Y-%m-%d')),
    'interval': fields.String(required=False, enum=PriceIntervalEnum._member_names_, default='weekly'),
})


@api.route('/')
@api.response(404, 'Asset')
class Prices(Resource):
    @api.expect(asset_price_request, validate=True)
    @api.marshal_with(asset_returns)
    def post(self) -> asset_returns:
        args = request.json
        print(args)
        try:
            ticker = args['ticker'].upper()
            start_date = dateparser.parse(args['start_date']).strftime('%Y-%m-%d')
            end_date = dateparser.parse(args['end_date']).strftime('%Y-%m-%d')
            yf = YahooFinancials(ticker)
            prices = yf.get_historical_price_data(start_date, end_date, args['interval'])
            print(prices)
            ret_prices = [
                {'date': datetime.utcfromtimestamp(price['date']).strftime('%Y-%m-%d'),
                 'close': price['close']} for price in prices[ticker]['prices']]
            return {'prices': ret_prices, 'ticker': ticker}
        except Exception as e:
            pass
        return {
            'id': 3,
            'name': 'bob'
        }
