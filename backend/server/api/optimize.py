from datetime import datetime, timedelta

from flask_restplus import Namespace, Resource, fields
from flask import request, jsonify

from server.app import task_optimize
from .rest_models import *
from server.db import portfolios

api = Namespace('optimize', description='Handles portfolio optimization')

optimize_job_request = api.model('Optimize Job Request', {
    'name': fields.String(),
    'tickers': fields.List(fields.String(required=True)),
    'start_date': fields.String(required=True,
                                default=datetime.today().strftime('%Y-%m-%d')),
    'end_date': fields.String(required=True,
                              default=(datetime.today() - timedelta(7)).strftime('%Y-%m-%d')),
    'interval': fields.String(required=False, enum=PriceIntervalEnum._member_names_, default='weekly'),
})

optimize_job_return = api.model('Optimization job return', {
    'task_id': fields.String(required=True)
})


@api.route('/submit-job')
class SubmitOptimizeJob(Resource):
    @api.expect(optimize_job_request)
    @api.marshal_with(optimize_job_return)
    def post(self):
        args = request.json
        print('Processing optimization job submission for', args)
        # TODO add name and user ID to task
        task_id = task_optimize.delay(args['tickers'], args['start_date'], args['end_date'], args['interval'])
        # TODO stub out entry in results db with task and user id
        return {'task_id': str(task_id)}


@api.route('/check-job/<id>')
@api.doc(params={'id': 'id of job'})
class CheckJob(Resource):
    def get(self, id):
        return jsonify(portfolios.get_by_task_id(id))


@api.route('/portfolio/<id>')
@api.doc(params={'id': 'Database ID of portfolio'})
class Portfolio(Resource):
    def get(self, id):
        return jsonify(portfolios.get_portfolio(id))
