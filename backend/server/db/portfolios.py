from bson.objectid import ObjectId

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
    return _id_to_str_util(portfolios_col.find_one({'_id': ObjectId(portfolio_id)}))
