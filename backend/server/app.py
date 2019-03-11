from flask import Flask
from flask_restplus import Resource
from server.api import api
from server.make_celery import make_celery
from server.config import config

app = Flask(__name__)
app.config.update(
    CELERY_RESULT_BACKEND=f'mongodb://{config["DB_HOST"]}:{config["DB_PORT"]}/tasks',
    CELERY_BROKER_URL=f'pyamqp://{config["BROKER_USER"]}:{config["BROKER_PASSWORD"]}@{config["BROKER_HOST"]}//'
)
celery = make_celery(app)
api.init_app(app)


@celery.task(name="tasks.add_together")
def add_together(a, b):
    return a + b


@api.route('/asset-prices')
class AssetPrices(Resource):
    def get(self):
        add_together.delay(234, 234243)
        return {'hello': 'world'}
