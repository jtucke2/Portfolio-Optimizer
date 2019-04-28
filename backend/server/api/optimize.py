from datetime import datetime, timedelta

from flask_restplus import Namespace, Resource, fields
from flask import request, jsonify
from flask_jwt_extended import jwt_required, current_user

from server.app import task_optimize
from .rest_models import *
from server.db import portfolios

api = Namespace('optimize', description='Handles portfolio optimization')

optimize_job_request = api.model('Optimize Job Request', {
    'name': fields.String(required=True),
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
    @jwt_required
    def post(self):
        args = request.json
        print('Processing optimization job submission for', args)
        user_id = current_user.get('user_id')
        task_id = task_optimize.delay(args['name'], args['tickers'], args['benchmark_index'], args['start_date'], args['end_date'], user_id, args['interval'])
        # TODO stub out entry in results db with task and user id
        return {'task_id': str(task_id)}


@api.route('/check-job/<task_ids>')
@api.doc(params={'task_ids': 'id of task in Celery, use comma delimiter if multiple tasks'})
class CheckJob(Resource):
    @jwt_required
    def get(self, task_ids):
        return [portfolios.get_by_task_id(task_id) for task_id in task_ids.split(',')]


@api.route('/portfolio/<id>')
@api.doc(params={'id': 'Database ID of portfolio'})
class PortfolioById(Resource):
    @jwt_required
    def get(self, id):
        return portfolios.get_portfolio(id)


@api.route('/portfolio')
class Portfolio(Resource):
    """Returns portfolios submitted by the user, or published to all users"""
    @jwt_required
    def get(self):
        user_id = current_user.get('user_id')
        return portfolios.get_portfolios_by_user(user_id)
