from flask_restplus import Api

from server.api.prices import api as prices_ns
from server.api.optimize import api as optimize_ns
from server.api.user import api as user_ns
from server.api.admin import api as admin_ns

authorizations = {
    'apikey': {
        'type': 'apiKey',
        'in': 'header',
        'name': 'authorization'
    }
}

api = Api(
    title='Portfolio Optimizer',
    version='1.0',
    description='Optimize weights of financial assets inside of a portfolio.  ' +
    'Use /user/login route to get a token, then click the authorize button.',
    doc="/swagger",
    authorizations=authorizations,
    security='apikey'
)

api.add_namespace(prices_ns)
api.add_namespace(optimize_ns)
api.add_namespace(user_ns)
api.add_namespace(admin_ns)
