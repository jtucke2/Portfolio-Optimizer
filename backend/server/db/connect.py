from pymongo import MongoClient, database, collection
from server.config import config

conn_string = f'mongodb://{config["DB_HOST"]}:{config["DB_PORT"]}/'
print('Attempt to connect to mongodb at: ', conn_string)
client = MongoClient(conn_string)

# Portfolio-optimizer defined db/collections
po_db: database.Database = client.po
portfolios_col: collection.Collection = po_db.portfolios
user_col: collection.Collection = po_db.user

# Celery defined db/collections
tasks_db: database.Database = client.tasks
celery_taskmeta_col: collection.Collection = tasks_db.celery_taskmeta
