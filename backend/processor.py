"""
This file is used to preload the database with configuration data
"""
from server.db.connect import user_col
from server.config import config
from server.shared import auth
from server.shared.auth import UserRoles

if __name__ == '__main__':
    admin_user = user_col.find_one({'data.email': config['ADMIN_USER_EMAIL']})
    print('Task: Create auto-generated admin user')
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
