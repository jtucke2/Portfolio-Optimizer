from server.app import app
from server.config import config

# Note, this file exists because I was having issues with module levels
# imports working in app.py for both flask and celery

if __name__ == '__main__':
    if config["IN_DOCKER"]:
        print('Starting server with docker settings')
        app.run(port="5000", host="0.0.0.0")
    else:
        print('Starting server with local execution settings, please be sure to use port 5005')
        app.run(debug=True, port="5005")
