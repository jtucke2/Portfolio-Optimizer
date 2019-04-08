from datetime import datetime, timedelta
from dateutil import parser as dateparser
import json

from flask_restplus import Namespace, Resource, fields
from flask import request
from yahoofinancials import YahooFinancials
from flask_jwt_extended import jwt_required

from .rest_models import *


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
    @jwt_required
    def post(self) -> asset_returns:
        args = request.json
        print('Processing price request for', args)
        try:
            ticker = args['ticker'].upper()
            start_date = dateparser.parse(args['start_date']).strftime('%Y-%m-%d')
            end_date = dateparser.parse(args['end_date']).strftime('%Y-%m-%d')
            yf = YahooFinancials(ticker)
            prices = yf.get_historical_price_data(start_date, end_date, args['interval'])
            ret_prices = [
                {'date': datetime.utcfromtimestamp(price['date']).strftime('%Y-%m-%d'),
                 'close': price['close']} for price in prices[ticker]['prices'] if price['close'] is not None]
            return {'prices': ret_prices, 'ticker': ticker}
        except Exception as e:
            return {'message': 'Unable to retrive prices'}, 500


@api.route('/asset-data/<ticker>')
@api.doc(params={'ticker': 'The ticker symbol of the asset'})
@api.response(404, 'Asset')
class AssetData(Resource):
    @jwt_required
    def get(self, ticker: str) -> asset_returns:
        try:
            ticker = ticker.upper()
            yf = YahooFinancials(ticker)
            quote_type_data = yf.get_stock_quote_type_data()
            # This one seems very slow
            key_stats = yf.get_key_statistics_data()
            return json.dumps({'ticker': ticker, 'quote_type_data': quote_type_data[ticker], 'key_stats': key_stats[ticker]})
        except Exception as e:
            return {'message': 'Unable to retrive prices'}, 500
