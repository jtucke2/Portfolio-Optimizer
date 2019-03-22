from datetime import datetime, timedelta

from flask_restplus import Namespace, Resource, fields
from flask import request, jsonify
from flask_jwt_extended import create_access_token

api = Namespace('user', description='User/account related operations')

login_request = api.model('User Login Request', {
    'username': fields.String(required=True),
    'password': fields.String(required=True)
})

login_request_return = api.model('User Login Return', {
    'token': fields.String(),
    'msg': fields.String(required=False)
})


@api.route('/login')
class SubmitOptimizeJob(Resource):
    @api.expect(login_request)
    @api.marshal_with(login_request_return)
    def post(self):
        username = request.json.get('username', None)
        password = request.json.get('password', None)
        if not username:
            return jsonify({'msg': 'Missing username parameter'}), 400
        if not password:
            return jsonify({'msg': 'Missing password parameter'}), 400
        # TODO do real auth
        user_id = '345345'
        access_token = create_access_token(identity=user_id)
        foo = {
            'token': access_token
        }
        return foo
