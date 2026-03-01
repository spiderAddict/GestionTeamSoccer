DATABASE_URI = 'sqlite:///instance/gestion_team.db'

class Config:
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = DATABASE_URI
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = 'your_secret_key_here'  # Change this to a random secret key for production