from pymongo import MongoClient
from server.config import config

conn_string = f'mongodb://{config["DB_HOST"]}:{config["DB_PORT"]}/'
print('Attempt to connect to mongodb at: ', conn_string)
client = MongoClient(conn_string)
db = client.po
portfolios_col = db.portfolios
