from flask_restplus import Api

from server.api.prices import api as prices_ns
from server.api.optimize import api as optimize_ns

api = Api(
    title='Portfolio Optimizer',
    version='1.0',
    description='Optimize weights of financial assets inside of a portfolio',
    doc="/swagger"
)

api.add_namespace(prices_ns)
api.add_namespace(optimize_ns)
