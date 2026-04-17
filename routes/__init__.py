from .players import router as players_router
from .matchs import router as matchs_router
from .payments import router as payments_router
from .version import router as version_router

__all__ = [
    "players_router",
    "matchs_router",
    "payments_router",
    "version_router",
]