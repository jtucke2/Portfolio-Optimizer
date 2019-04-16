from typing import List
import json
from bson.objectid import ObjectId
from bson import json_util

from server.db.connect import portfolios_col, celery_taskmeta_col
from . import _id_to_str_util


def insert_job(job: dict) -> str:
    result = portfolios_col.insert_one(job)
    return str(result.inserted_id)


def get_by_task_id(task_id: str) -> dict:
    """See if task is complete, return data if complete

    :param task_id:
    :return:
    """
    ret_val = {
        'found': False,
        'task_status': None,
        'data': None
    }
    task_doc = celery_taskmeta_col.find_one({'_id': task_id})
    if task_doc:
        ret_val['found'] = True
        ret_val['task_status'] = task_doc['status']
        if task_doc['status'] == 'SUCCESS':
            portfolio_id = task_doc['result'][1:-1]  # Remove extra quotations
            ret_val['data'] = _id_to_str_util(portfolios_col.find_one({'_id': ObjectId(portfolio_id)}))
    return ret_val


def get_portfolio(portfolio_id: str) -> dict:
    doc = _id_to_str_util(portfolios_col.find_one({'_id': ObjectId(portfolio_id)}))
    return json.loads(json.dumps(doc, default=json_util.default))


def get_portfolios_by_user(user_id: str, include_published: bool = True) -> List[dict]:
    if include_published:
        query = {
            "$or": [
                {"user_id": user_id},
                {"published": True}
            ]
        }
    else:
        query = {"user_id": user_id}
    project = {
        'job_start': 1,
        'job_end': 1,
        'parameters': 1,
        'user_id': 1,
        'task_id': 1,
        'published': 1,
        'name': 1
    }
    doc_list = list(portfolios_col.find(query, project))
    str_id_list = [_id_to_str_util(doc) for doc in doc_list]
    ret_val = json.loads(json.dumps(str_id_list, default=json_util.default))
    return ret_val
