from flask import Blueprint

# Initialisation du module des routes
routes_bp = Blueprint('routes', __name__)

from .players import *
from .seasons import *
from .matches import *
from .payments import *