from flask import Flask
from .config import Config
from .routes import players, seasons, matches, payments

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    app.register_blueprint(players.bp)
    app.register_blueprint(seasons.bp)
    app.register_blueprint(matches.bp)
    app.register_blueprint(payments.bp)

    return app