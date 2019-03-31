from json import loads as json_loads
from datetime import timedelta
from flask import Flask
from flask_jwt_extended import JWTManager

from server.make_celery import make_celery
from server.config import config
from server.tasks.optimize import do_task_optimize

app = Flask(__name__)
app.config.update(
    CELERY_RESULT_BACKEND=f'mongodb://{config["DB_HOST"]}:{config["DB_PORT"]}/tasks',
    CELERY_BROKER_URL=f'pyamqp://{config["BROKER_USER"]}:{config["BROKER_PASSWORD"]}@{config["BROKER_HOST"]}//',
    JWT_SECRET_KEY='super-secret-oh-change-this-plz',  # TODO
    JWT_HEADER_TYPE='',
    JWT_ACCESS_TOKEN_EXPIRES=timedelta(days=3)
)
celery = make_celery(app)
jwt = JWTManager(app)


@jwt.user_loader_callback_loader
def user_loader_callback(identity):
    return json_loads(identity)


@celery.task(name='tasks.task_optimize')
def task_optimize(tickers, start_date, end_date, interval='weekly'):
    return do_task_optimize(tickers, start_date, end_date, interval)
