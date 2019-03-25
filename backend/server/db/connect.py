from pymongo import MongoClient
from server.config import config

conn_string = f'mongodb://{config["DB_HOST"]}:{config["DB_PORT"]}/'
print('Attempt to connect to mongodb at: ', conn_string)
client = MongoClient(conn_string)

# Portfolio-optimizer defined db/collections
po_db = client.po
portfolios_col = po_db.portfolios
user_col = po_db.user

# Celery defined db/collections
tasks_db = client.tasks
celery_taskmeta_col = tasks_db.celery_taskmeta
