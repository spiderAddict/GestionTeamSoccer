from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Player(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String(50), nullable=False)
    last_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(100), nullable=True)
    phone_number = db.Column(db.String(15), nullable=True)
    additional_info = db.Column(db.Text, nullable=True)

class Season(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    matches = db.relationship('Match', backref='season', lazy=True)

class Match(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.DateTime, nullable=False)
    season_id = db.Column(db.Integer, db.ForeignKey('season.id'), nullable=False)
    players = db.relationship('PlayerMatch', backref='match', lazy=True)

class PlayerMatch(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    player_id = db.Column(db.Integer, db.ForeignKey('player.id'), nullable=False)
    match_id = db.Column(db.Integer, db.ForeignKey('match.id'), nullable=False)

class Payment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    payer_id = db.Column(db.Integer, db.ForeignKey('player.id'), nullable=False)
    payee_id = db.Column(db.Integer, db.ForeignKey('player.id'), nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    match_id = db.Column(db.Integer, db.ForeignKey('match.id'), nullable=False)