import uuid
from .. import db
from .. import api
from flask_restx import fields

class Player(db.Model):

    __tablename__ = "player"

    id = db.Column(
        db.String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4())
    )
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), nullable=True)
    phone_number = db.Column(db.String(15), nullable=True)
    additional_info = db.Column(db.Text, nullable=True)

# Swagger model
player_model = api.model("Player", {
    "id": fields.String(
        readOnly=True,
        description="UUID joueur"
    ),
    "first_name": fields.String(required=True, description="Nom joueur"),
    "last_name": fields.String(required=True, description="Prénom joueur"),
    "email": fields.String(required=False, description="Email joueur"),
    "phone_number": fields.String(required=False, description="Numéro de téléphone joueur"),
    "additional_info": fields.String(required=False, description="Informations supplémentaires joueur")
})