from server.app import app

if __name__ == '__main__':
    app.run(debug=True, port="5000", host="0.0.0.0")
