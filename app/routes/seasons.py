from flask import Blueprint, request, jsonify
from ..models.player import Season
from .. import db

seasons_bp = Blueprint('seasons', __name__)

@seasons_bp.route('/seasons', methods=['POST'])
def create_season():
    data = request.get_json()
    new_season = Season(name=data['name'], start_date=data['start_date'])
    db.session.add(new_season)
    db.session.commit()
    return jsonify(new_season.to_dict()), 201

@seasons_bp.route('/seasons', methods=['GET'])
def get_seasons():
    seasons = Season.query.all()
    return jsonify([season.to_dict() for season in seasons]), 200

@seasons_bp.route('/seasons/<int:season_id>', methods=['PUT'])
def update_season(season_id):
    data = request.get_json()
    season = Season.query.get_or_404(season_id)
    season.name = data['name']
    season.start_date = data['start_date']
    db.session.commit()
    return jsonify(season.to_dict()), 200

@seasons_bp.route('/seasons/<int:season_id>', methods=['DELETE'])
def delete_season(season_id):
    season = Season.query.get_or_404(season_id)
    db.session.delete(season)
    db.session.commit()
    return jsonify({'message': 'Season deleted'}), 204