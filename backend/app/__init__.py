from flask import Flask
from flask_restx import Api
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy

import os

db = SQLAlchemy()

api = Api(
    version="1.0", 
    title="API Demo", 
    description="Documentation Swagger"
)

def create_app():
    app = Flask(__name__, instance_relative_config=True)

    db_path = os.path.join(app.instance_path, "gestion_team.db")
    app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{db_path}"

    os.makedirs(app.instance_path, exist_ok=True)
    
    # Initialiser la base de données
    db.init_app(app)
    api.init_app(app)

    # ⚡ Autoriser React
    CORS(app, resources={r"/api/*": {"origins": "*"}})
    
    # Import namespace
    from .routes.players import ns as players_ns
    api.add_namespace(players_ns, path="/api/players")

    # 👇 IMPORTER LES MODELES AVANT create_all
    from .models.player import Player

    with app.app_context():
        db.create_all()

    return app