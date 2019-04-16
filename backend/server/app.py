from json import loads as json_loads
from datetime import timedelta
from typing import List
from flask import Flask
from flask_jwt_extended import JWTManager

from server.make_celery import make_celery
from server.config import config
from server.tasks.optimize import do_task_optimize

app = Flask(__name__)
app.config.update(
    CELERY_RESULT_BACKEND=f'mongodb://{config["DB_HOST"]}:{config["DB_PORT"]}/tasks',
    CELERY_BROKER_URL=f'pyamqp://{config["BROKER_USER"]}:{config["BROKER_PASSWORD"]}@{config["BROKER_HOST"]}//',
    JWT_SECRET_KEY=config['JWT_SECRET_KEY'],
    JWT_HEADER_TYPE='',
    JWT_ACCESS_TOKEN_EXPIRES=timedelta(days=3)
)
celery = make_celery(app)
jwt = JWTManager(app)


@jwt.user_loader_callback_loader
def user_loader_callback(identity):
    return json_loads(identity)


@celery.task(name='tasks.task_optimize')
def task_optimize(name: str, tickers: List[str], benchmark_index: str, start_date: str, end_date: str, user_id: str, interval='weekly'):
    task_id = task_optimize.request.id
    return do_task_optimize(name, tickers, benchmark_index, start_date, end_date, user_id, task_id, interval)
