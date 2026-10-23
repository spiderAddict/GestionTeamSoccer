from fastapi import Depends, HTTPException, Query
from database import get_db
from models import Season
from sqlalchemy.orm import Session


# --- Résolution de la saison (en cours / demandée) ---
def get_current_season(db: Session = Depends(get_db)) -> Season:
    current_season: Season | None = db.query(Season).filter(Season.closed_at.is_(None)).first()
    if not current_season:
        raise HTTPException(status_code=500, detail="Aucune saison en cours n'est configurée")
    return current_season

def get_selected_season(season_id: int | None = Query(None), db: Session = Depends(get_db)) -> Season:
    if season_id is None:
        return get_current_season(db)
    season: Season | None = db.get(Season, season_id)
    if not season:
        raise HTTPException(status_code=404, detail="Saison introuvable")
    return season

def ensure_season_open(season: Season | None) -> None:
    if season is not None and season.closed_at is not None:
        raise HTTPException(status_code=409, detail="Saison clôturée : les matchs ne sont plus modifiables")
