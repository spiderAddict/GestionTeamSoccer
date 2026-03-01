from flask import Blueprint, request, jsonify
from ..models import Player, db

players_bp = Blueprint('players', __name__)

@players_bp.route('/players', methods=['POST'])
def create_player():
    data = request.get_json()
    new_player = Player(
        first_name=data['first_name'],
        last_name=data['last_name'],
        email=data.get('email'),
        phone=data.get('phone'),
        additional_info=data.get('additional_info')
    )
    db.session.add(new_player)
    db.session.commit()
    return jsonify(new_player.to_dict()), 201

@players_bp.route('/players', methods=['GET'])
def get_players():
    players = Player.query.all()
    return jsonify([player.to_dict() for player in players]), 200

@players_bp.route('/players/<int:player_id>', methods=['PUT'])
def update_player(player_id):
    data = request.get_json()
    player = Player.query.get_or_404(player_id)
    player.first_name = data['first_name']
    player.last_name = data['last_name']
    player.email = data.get('email')
    player.phone = data.get('phone')
    player.additional_info = data.get('additional_info')
    db.session.commit()
    return jsonify(player.to_dict()), 200

@players_bp.route('/players/<int:player_id>', methods=['DELETE'])
def delete_player(player_id):
    player = Player.query.get_or_404(player_id)
    db.session.delete(player)
    db.session.commit()
    return jsonify({'message': 'Player deleted successfully'}), 204