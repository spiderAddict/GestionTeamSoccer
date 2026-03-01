from flask import Blueprint, request, jsonify
from ..models import Match, db

matches_bp = Blueprint('matches', __name__)

@matches_bp.route('/matches', methods=['POST'])
def create_match():
    data = request.get_json()
    new_match = Match(date=data['date'], season_id=data['season_id'])
    db.session.add(new_match)
    db.session.commit()
    return jsonify({'id': new_match.id}), 201

@matches_bp.route('/matches', methods=['GET'])
def get_matches():
    matches = Match.query.all()
    return jsonify([match.to_dict() for match in matches]), 200

@matches_bp.route('/matches/<int:match_id>', methods=['GET'])
def get_match(match_id):
    match = Match.query.get_or_404(match_id)
    return jsonify(match.to_dict()), 200

@matches_bp.route('/matches/<int:match_id>', methods=['PUT'])
def update_match(match_id):
    data = request.get_json()
    match = Match.query.get_or_404(match_id)
    match.date = data['date']
    match.season_id = data['season_id']
    db.session.commit()
    return jsonify({'message': 'Match updated successfully'}), 200

@matches_bp.route('/matches/<int:match_id>', methods=['DELETE'])
def delete_match(match_id):
    match = Match.query.get_or_404(match_id)
    db.session.delete(match)
    db.session.commit()
    return jsonify({'message': 'Match deleted successfully'}), 204