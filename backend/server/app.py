from flask import Flask
from flask_restplus import Resource

# from server.api import api
from server.make_celery import make_celery
from server.config import config
from server.tasks.optimize import do_task_optimize

app = Flask(__name__)
app.config.update(
    CELERY_RESULT_BACKEND=f'mongodb://{config["DB_HOST"]}:{config["DB_PORT"]}/tasks',
    CELERY_BROKER_URL=f'pyamqp://{config["BROKER_USER"]}:{config["BROKER_PASSWORD"]}@{config["BROKER_HOST"]}//'
)
celery = make_celery(app)
# api.init_app(app)


@celery.task(name='tasks.task_optimize')
def task_optimize(tickers, start_date, end_date, interval='weekly'):
    return do_task_optimize(tickers, start_date, end_date, interval)
