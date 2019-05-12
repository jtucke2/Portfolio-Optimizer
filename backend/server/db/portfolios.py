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
        'task': None,
        'result': None,
        'message': None
    }
    task_doc = celery_taskmeta_col.find_one({'_id': task_id})
    if task_doc:
        ret_val['found'] = True
        ret_val['task'] = json.loads(json.dumps(task_doc, default=json_util.default))
        if task_doc['status'] == 'SUCCESS':
            portfolio_id = task_doc['result'][1:-1]  # Remove extra quotations
            project = {
                'job_start': 1,
                'job_end': 1,
                'parameters': 1,
                'user_id': 1,
                'task_id': 1,
                'published': 1,
                'name': 1
            }
            result_doc = portfolios_col.find_one({'_id': ObjectId(portfolio_id)}, project)
            if result_doc:
                ret_val['result'] = json.loads(json.dumps(_id_to_str_util(result_doc), default=json_util.default))
            else:
                ret_val['message'] = 'Task was successfully completely, but unable to find result'
    else:
        ret_val['message'] = 'Unable to find task'
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


def update_portfolio(portfolio_id: str, update: dict) -> dict:
    res = portfolios_col.update_one({'_id': ObjectId(portfolio_id)}, update)
    return {
        'found': bool(res.matched_count),
        'updated': bool(res.modified_count)
    }


def publish_portfolio(portfolio_id: str) -> dict:
    return update_portfolio(portfolio_id, {'$set': {'published': True}})


def rename_portfolio(portfolio_id: str, name: str) -> dict:
    return update_portfolio(portfolio_id, {'$set': {'name': name}})


def delete_portfolio(portfolio_id: str) -> dict:
    res = portfolios_col.delete_one({'_id': ObjectId(portfolio_id)})
    return {
        'deleted_count': res.deleted_count,
        'deleted': bool(res.deleted_count)
    }
