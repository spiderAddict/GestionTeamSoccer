from fastapi import APIRouter, HTTPException
from typing import List
from models.player import Player

router = APIRouter(
    prefix="/api/players",
    tags=["players"]
)

# Données en mémoire pour l'exemple
players: List[Player] = [
    Player(id=1, name="Lionel Messi", position="Forward", team="PSG"),
    Player(id=2, name="Cristiano Ronaldo", position="Forward", team="Al Nassr")
]

# --- Routes ---
@router.get("", response_model=List[Player])
def get_players():
    return players

@router.post("", response_model=Player)
def create_player(player: Player):
    players.append(player)
    return player

@router.get("/{player_id}", response_model=Player)
def get_player(player_id: int):
    for p in players:
        if p.id == player_id:
            return p
    raise HTTPException(status_code=404, detail="Player not found")

@router.put("/{player_id}", response_model=Player)
def update_player(player_id: int, player: Player):
    for i, p in enumerate(players):
        if p.id == player_id:
            players[i] = player
            return player
    raise HTTPException(status_code=404, detail="Player not found")

@router.delete("/{player_id}")
def delete_player(player_id: int):
    global players
    players = [p for p in players if p.id != player_id]
    return {"status": "deleted"}

    

# from flask_restx import Namespace, Resource
# from ..models.player import Player, player_model
# from .. import db

# ns = Namespace("players", description="Opérations sur les joueurs")

# @ns.route("/")
# class PlayerList(Resource):

#     @ns.marshal_list_with(player_model)
#     def get(self):
#         """Lister tous les joueurs"""
#         return Player.query.all()

#     @ns.expect(player_model)
#     @ns.marshal_with(player_model, code=201)
#     def post(self):
#         """Créer un joueur"""
#         data = ns.payload
#         player = Player(
#             name=data["name"],
#             email=data["email"]
#         )
#         db.session.add(player)
#         db.session.commit()
#         return player, 201
    
# @ns.route("/<string:id>")
# class PlayerResource(Resource):
#     @ns.marshal_with(player_model)
#     def get(self, id):
#         return Player.query.get_or_404(id)

#     @ns.expect(player_model)
#     @ns.marshal_with(player_model)
#     def put(self, id):
#         player = Player.query.get_or_404(id)
#         data = ns.payload
#         player.name = data["name"]
#         player.email = data["email"]
#         db.session.commit()
#         return player

#     def delete(self, id):
#         player = Player.query.get_or_404(id)
#         db.session.delete(player)
#         db.session.commit()
#         return {"message": "Utilisateur supprimé"}, 204