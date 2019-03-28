from enum import Enum
from typing import Optional, List
from bcrypt import hashpw, checkpw, gensalt

from server.db import user as user_dao


class UserRoles(Enum):
    STANDARD_USER = 'STANDARD_USER'
    ADMIN = 'ADMIN'


def str_to_hash(password_str: str) -> bytes:
    return hashpw(str.encode(password_str), gensalt())


def check_pw(password_str: str, hashed: bytes) -> bool:
    return checkpw(str.encode(password_str), hashed)


def generate_user(password_str: str, first_name: str, last_name: str,
                  email: str, role: UserRoles = UserRoles.STANDARD_USER) -> dict:
    # TODO check if name/email is unique + add index
    hashed = str_to_hash(password_str)
    doc = {
        'data': {
            'first_name': first_name,
            'last_name': last_name,
            'email': email,
            'role': role.value,
            'approved': False
        },
        'pw_hash': hashed
    }
    try:
        user_id = user_dao.insert_user(doc)
        user = doc['data']
        user['user_id'] = user_id
        return {
            'success': True,
            'user': user
        }
    except Exception as e:
        return {
            'success': False
        }


def login(email: str, password_str: str) -> Optional[dict]:
    user = user_dao.find_user_by_email(email)
    if user and check_pw(password_str, user['pw_hash']):
        return user
    else:
        return None


def get_unapproved_users() -> List[dict]:
    users = []
    temp = user_dao.find_users({'data.approved': False})
    for item in temp:
        user = item['data']
        user['user_id'] = str(item['_id'])
        users.append(user)
    return users


def change_user_approval(user_id, approved: bool = True) -> dict:
    return user_dao.update_user(user_id, {'data.approved': approved})
