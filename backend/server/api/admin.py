from datetime import datetime, timedelta

from flask_restplus import Namespace, Resource
from flask_jwt_extended import jwt_required, current_user

from server.shared import auth
from server.shared.auth import UserRoles

api = Namespace('admin', description='Admin specific routes')


def is_admin():
    if current_user.get('role') == UserRoles.ADMIN.value:
        return True
    else:
        return False


@api.route('/unapproved-users')
class UnapprovedUsers(Resource):
    @jwt_required
    def get(self):
        if is_admin():
            return auth.get_unapproved_users()
        else:
            return {'message': 'You must be an admin to access this route'}, 403


@api.route('/approve-user/<user_id>')
@api.doc(params={'user_id': 'ID of user to approve'})
class ApproveUser(Resource):
    @jwt_required
    def get(self, user_id):
        if is_admin():
            res = auth.change_user_approval(user_id)
            if res['found'] and res['updated']:
                return {'success': True}
            elif res['found'] and not res['updated']:
                return {'success': False, 'message': 'User is already approved'}, 400
            else:
                return {'success': False, 'message': 'Unable to find user'}, 404
        else:
            return {'success': False, 'message': 'You must be an admin to access this route'}, 403
