from flask import Flask
from flask_restplus import Resource, Api
from server.make_celery import make_celery

app = Flask(__name__)
app.config.update(
    CELERY_RESULT_BACKEND='mongodb://po-database:27017/tasks',
    CELERY_BROKER_URL='pyamqp://admin:password@po-task-queue//'
)
celery = make_celery(app)
api = Api(app, doc="/swagger")


@celery.task(name="tasks.add_together")
def add_together(a, b):
    return a + b


@api.route('/asset-prices')
class AssetPrices(Resource):
    def get(self):
        add_together.delay(234, 234243)
        return {'hello': 'world'}


# if __name__ == '__main__':
#     app.run(debug=True, port="5000", host="0.0.0.0")
