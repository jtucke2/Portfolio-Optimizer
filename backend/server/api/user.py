from datetime import datetime, timedelta

from flask_restplus import Namespace, Resource, fields
from flask import request
from flask_jwt_extended import create_access_token
from json import dumps as json_dumps

from server.shared import auth

api = Namespace('user', description='User/account related operations')

user_model = api.model('user', {
    'username': fields.String(),
    'first_name': fields.String(),
    'last_name': fields.String(),
    'email': fields.String(),
    'user_id': fields.String(),
    'approved': fields.Boolean(),
    'role': fields.String(),
})

login_request = api.model('User Login Request', {
    'username': fields.String(required=True),
    'password': fields.String(required=True)
})

login_request_return = api.model('User Login Return', {
    'token': fields.String(),
    'message': fields.String(required=False),
    'user': fields.Nested(user_model)
})


@api.route('/login')
class SubmitOptimizeJob(Resource):
    @api.expect(login_request, validate=True)
    @api.marshal_with(login_request_return)
    def post(self):
        username = request.json.get('username', None)
        password = request.json.get('password', None)
        if not username:
            return {'message': 'Missing username parameter'}, 400
        if not password:
            return {'message': 'Missing password parameter'}, 400

        user = auth.login(username, password)
        if user and user.get('data') and not user.get('data').get('approved'):
            return {'message': 'You are pending approval by an administrator'}, 401
        elif user and user.get('data') and user.get('data').get('approved'):
            user_id = str(user['_id'])
            identity = json_dumps({'user_id': user_id, 'role': user.get('data').get('role')})
            access_token = create_access_token(identity=identity)
            user_data = user.get('data')
            user_data['user_id'] = user_id
            return {
                'token': access_token,
                'user': user_data
            }
        else:
            return {'message': 'Incorrect user name and/or password'}, 400


register_request = api.model('register_request', {
    'username': fields.String(required=True),
    'first_name': fields.String(required=True),
    'last_name': fields.String(required=True),
    'email': fields.String(required=True),
    'password': fields.String(required=True),
    'password_confirm': fields.String(required=True),
})

register_return = api.model('Registration return', {
    'message': fields.String(required=False),
    'user': fields.Nested(user_model)
})


@api.route('/register')
class Register(Resource):
    @api.expect(register_request, validate=True)
    @api.marshal_with(register_return)
    def post(self):
        args = request.json
        if args.get('password') != args.get('password_confirm'):
            return {'message': 'Password must match password confirmation'}, 400
        gen_user = auth.generate_user(args['username'], args['password'], args['first_name'], args['last_name'], args['email'])
        if gen_user.get('success'):
            return {'user': gen_user.get('user')}
        else:
            return {'message': 'An error occurred while attempting to create user'}, 500
