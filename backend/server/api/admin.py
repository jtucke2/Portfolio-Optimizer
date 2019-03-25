from datetime import datetime, timedelta

from flask_restplus import Namespace, Resource, fields
from flask import request
from flask_jwt_extended import create_access_token

from server.shared import auth

api = Namespace('admin', description='Admin specific routes')


@api.route('/unapproved-users')
class UnapprovedUsers(Resource):
    def get(self):
        return auth.get_unapproved_users()


@api.route('/approve-user/<user_id>')
@api.doc(params={'user_id': 'ID of user to approve'})
class ApproveUser(Resource):
    def get(self, user_id):
        res = auth.change_user_approval(user_id)
        if res['found'] and res['updated']:
            return {'success': True}
        elif res['found'] and not res['updated']:
            return {'success': False, 'message': 'User is already approved'}, 400
        else:
            return {'success': False, 'message': 'Unable to find user'}, 404
