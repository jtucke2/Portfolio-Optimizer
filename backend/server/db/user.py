from typing import Optional
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
