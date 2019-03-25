from enum import Enum
from typing import Optional
from bcrypt import hashpw, checkpw, gensalt

from server.db import user as user_dao

class UserRoles(Enum):
    STANDARD_USER = 'STANDARD_USER'
    ADMIN = 'ADMIN'


def str_to_hash(password_str: str) -> bytes:
    return hashpw(str.encode(password_str), gensalt())


def check_pw(password_str: str, hashed: bytes) -> bool:
    return checkpw(str.encode(password_str), hashed)


def generate_user(username: str, password_str: str, first_name: str, last_name: str,
                  email: str, role: UserRoles = UserRoles.STANDARD_USER) -> dict:
    # TODO check if name/email is unique + add index
    hashed = str_to_hash(password_str)
    doc = {
        'data': {
            'username': username,
            'first_name': first_name,
            'last_name': last_name,
            'email': email,
            'role': role.value
        },
        'pw_hash': hashed
    }
    try:
        user_id = user_dao.insert_user(doc)
        return {
            'success': True,
            'user_id': user_id
        }
    except Exception as e:
        return {
            'success': False
        }


def login(username: str, password_str: str) -> Optional[dict]:
    user = user_dao.find_user_by_username(username)
    if user and check_pw(password_str, user['pw_hash']):
        return user
    else:
        return None

