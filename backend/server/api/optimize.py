from datetime import datetime, timedelta

from flask_restplus import Namespace, Resource, fields
from flask import request
from flask_jwt_extended import jwt_required, current_user

from server.app import task_optimize
from server.shared.auth import UserRoles
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
        return {'task_id': str(task_id)}, 202


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


@api.route('/publish-portfolio/<id>')
@api.doc(params={'id': 'Database ID of portfolio'})
class PublishPortfolio(Resource):
    @jwt_required
    def get(self, id):
        user_id = current_user.get('user_id')
        role = current_user.get('role')
        portfolio = portfolios.get_portfolio(id)
        if not portfolio:
            return {
                'success': False,
                'message': 'Portfolio not found'
            }, 404
        elif portfolio['user_id'] != user_id and role != UserRoles.ADMIN.value:
            return {
                'success': False,
                'message': 'You are only allowed to publish your own portfolios'
            }, 403

        publish_res = portfolios.publish_portfolio(id)
        if publish_res['updated']:
            return {'success': True}
        else:
            return {
                'success': False,
                'message': 'Portfolio already published'
            }


@api.route('/rename-portfolio/<id>/<name>')
@api.doc(params={'id': 'Database ID of portfolio', 'name': 'The new name for the portfolio'})
class RenamePortfolio(Resource):
    @jwt_required
    def get(self, id, name):
        user_id = current_user.get('user_id')
        role = current_user.get('role')
        portfolio = portfolios.get_portfolio(id)
        if not portfolio:
            return {
                'success': False,
                'message': 'Portfolio not found'
            }, 404
        elif portfolio['user_id'] != user_id and role != UserRoles.ADMIN.value:
            return {
                'success': False,
                'message': 'You are only allowed to rename your own portfolios'
            }, 403

        rename_res = portfolios.rename_portfolio(id, name)
        if rename_res['updated']:
            portfolio['name'] = name
            return {'success': True, 'portfolio': portfolio}
        else:
            return {
                'success': False,
                'message': 'Portfolio name is unchanged'
            }


@api.route('/delete-portfolio/<id>')
@api.doc(params={'id': 'Database ID of portfolio'})
class DeletePortfolio(Resource):
    @jwt_required
    def get(self, id):
        user_id = current_user.get('user_id')
        role = current_user.get('role')
        portfolio = portfolios.get_portfolio(id)
        if not portfolio:
            return {
                'success': False,
                'message': 'Portfolio not found'
            }, 404
        elif portfolio['user_id'] != user_id and role != UserRoles.ADMIN.value:
            return {
                'success': False,
                'message': 'You are only allowed to delete your own portfolios'
            }, 403

        rename_res = portfolios.delete_portfolio(id)
        if rename_res['deleted']:
            return {'success': True, 'message': f'Successfully deleted {portfolio["name"]}.'}
        else:
            return {
                'success': False,
                'message': 'Portfolio does not exist or could not be deleted'
            }
