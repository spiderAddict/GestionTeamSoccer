from flask_restx import Namespace, Resource
from ..models.player import Player, player_model
from .. import db

ns = Namespace("players", description="Opérations sur les joueurs")

@ns.route("/")
class PlayerList(Resource):

    @ns.marshal_list_with(player_model)
    def get(self):
        """Lister tous les joueurs"""
        return Player.query.all()

    @ns.expect(player_model)
    @ns.marshal_with(player_model, code=201)
    def post(self):
        """Créer un joueur"""
        data = ns.payload
        player = Player(
            name=data["name"],
            email=data["email"]
        )
        db.session.add(player)
        db.session.commit()
        return player, 201
    
@ns.route("/<string:id>")
class PlayerResource(Resource):
    @ns.marshal_with(player_model)
    def get(self, id):
        return Player.query.get_or_404(id)

    @ns.expect(player_model)
    @ns.marshal_with(player_model)
    def put(self, id):
        player = Player.query.get_or_404(id)
        data = ns.payload
        player.name = data["name"]
        player.email = data["email"]
        db.session.commit()
        return player

    def delete(self, id):
        player = Player.query.get_or_404(id)
        db.session.delete(player)
        db.session.commit()
        return {"message": "Utilisateur supprimé"}, 204