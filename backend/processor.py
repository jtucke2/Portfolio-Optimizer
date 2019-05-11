"""
This file is used to preload the database with configuration data
"""
from bson.json_util import loads as bson_loads
from bson.objectid import ObjectId

from server.db.connect import user_col, portfolios_col
from server.config import config
from server.shared import auth
from server.shared.auth import UserRoles


def create_admin_user():
    print('Task: Create auto-generated admin user')
    admin_user = user_col.find_one({'data.email': config['ADMIN_USER_EMAIL']})
    if admin_user:
        print('Admin user already exists')
    else:
        print('Creating user entry for', config['ADMIN_USER_EMAIL'])
        gen_user = auth.generate_user(
            config['ADMIN_USER_PW'],
            'Admin',
            'Admin',
            config['ADMIN_USER_EMAIL'],
            UserRoles.ADMIN,
            True)
        if gen_user.get('success'):
            print('Successfully created user entry:', gen_user.get('user'))
        else:
            print('Unable to create admin user')


def create_example_portfolio():
    print('Task: Create example portfolio')
    example_portfolio = portfolios_col.find_one({'_id': ObjectId('5cd7383037a484c573a4c696')})
    if example_portfolio:
        print('Example portfolio already exists')
    else:
        print('Creating example portfolio')
        try:
            example_portfolio_content = open('example-portfolio.json').read()
            portfolio_bson = bson_loads(example_portfolio_content)
            portfolios_col.insert_one(portfolio_bson)
            print('Successfully inserted example portfolio')
        except Exception as e:
            print('Unable to insert example portfolio')


if __name__ == '__main__':
    create_admin_user()
    create_example_portfolio()
