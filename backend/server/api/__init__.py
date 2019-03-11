from flask_restplus import Api

from server.api.prices import api as prices_ns

api = Api(
    title='Portfolio Optimizer',
    version='1.0',
    description='Optimize weights of financial assets inside of a portfolio',
    doc="/swagger"
)

api.add_namespace(prices_ns)
