from typing import Optional, List
from bson.objectid import ObjectId

from server.db.connect import user_col


def insert_user(user: dict) -> str:
    result = user_col.insert_one(user)
    return str(result.inserted_id)


def find_user_by_id(user_id: str) -> Optional[dict]:
    user = user_col.find_one({'_id': ObjectId(user_id)})
    return user


def find_user_by_username(username: str) -> Optional[dict]:
    user = user_col.find_one({'data.username': username})
    return user


def find_users(query: dict = {}) -> List[dict]:
    return list(user_col.find(query))


def update_user(user_id: str, update_dict: dict) -> dict:
    res = user_col.update_one({'_id': ObjectId(user_id)}, {'$set': update_dict})
    return {
        'found': bool(res.matched_count),
        'updated': bool(res.modified_count)
    }


def get_unapproved_users() -> List[dict]:
    users = []
    cur = user_col.find({'data.approved': False})
    for item in cur:
        user = item['data']
        user['user_id'] = str(item['_id'])
        users.append(user)
    return users
