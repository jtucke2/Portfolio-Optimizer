import os
from distutils.util import strtobool

from mypy_extensions import TypedDict

Config = TypedDict('Config', {
    'IN_DOCKER': bool,
    'BROKER_HOST': str,
    'BROKER_PORT': str,
    'BROKER_USER': str,
    'BROKER_PASSWORD': str,
    'DB_HOST': str,
    'DC_PORT': str
})


def build_config() -> Config:
    temp_config: Config = {
        'IN_DOCKER': False,
        'BROKER_HOST': 'localhost',
        'BROKER_USER': 'admin',
        'BROKER_PASSWORD': 'password',
        'DB_HOST': 'localhost',
        'DB_PORT': '27017'
    }
    try:
        if os.environ.get('IN_DOCKER') and strtobool(os.environ.get('IN_DOCKER')):
            temp_config['IN_DOCKER'] = True
            temp_config['BROKER_HOST'] = 'po-task-queue'
            temp_config['DB_HOST'] = 'po-database'
    except:
        pass
    return temp_config


config: Config = build_config()
