from fastapi import APIRouter, Depends, HTTPException
from typing import List
from database import get_db
from models import Match
from models import Player
from sqlalchemy.orm import Session
from pydantic import BaseModel
from datetime import date as DateType

router = APIRouter(
    prefix="/api/matchs",
    tags=["matchs"]
)

# --- Schéma Pydantic pour requêtes/réponses ---
class MatchSchema(BaseModel):
    id: str
    date: DateType
    result: str | None = None
    versus_team: str | None = None
    players: List[str]

    model_config = {
        "from_attributes": True
    }

# --- Schéma pour création / édition ---
class MatchCreate(BaseModel):
    date: DateType
    result: str | None = None
    versus_team: str | None = None
    players: List[str]

# --- CRUD --- 
@router.get("", response_model=List[MatchSchema])
def get_matchs(db: Session = Depends(get_db)):
    return db.query(Match).all()

@router.post("", response_model=MatchSchema)
def create_match(match: MatchCreate, db: Session = Depends(get_db)):
    if not (3 <= len(match.players) <= 8):
        raise HTTPException(status_code=400, detail="Il faut sélectionner entre 3 et 8 joueurs")
    
    # Vérifier que les joueurs existent
    db_players = db.query(Player).filter(Player.id.in_(match.players)).all()
    if len(db_players) != len(match.players):
        raise HTTPException(status_code=400, detail="Certains joueurs n'existent pas")

    db_match = Match(
        date=match.date,
        result=match.result,
        versus_team=match.versus_team,
        players=match.players
    )
    db.add(db_match)
    db.commit()
    db.refresh(db_match)
    return db_match

@router.get("/{match_id}", response_model=MatchSchema)
def get_match(match_id: str, db: Session = Depends(get_db)):
    db_match = db.query(Match).filter(Match.id == match_id).first()
    if not db_match:
        raise HTTPException(status_code=404, detail="Match not found")
    return db_match

@router.put("/{match_id}", response_model=MatchSchema)
def update_match(match_id: str, match: MatchCreate, db: Session = Depends(get_db)):
    db_match = db.query(Match).filter(Match.id == match_id).first()
    if not db_match:
        raise HTTPException(status_code=404, detail="Match not found")

    if not (3 <= len(match.players) <= 8):
        raise HTTPException(status_code=400, detail="Il faut sélectionner entre 3 et 8 joueurs")
    
    db_players = db.query(Player).filter(Player.id.in_(match.players)).all()
    if len(db_players) != len(match.players):
        raise HTTPException(status_code=400, detail="Certains joueurs n'existent pas")

    db_match.date = match.date
    db_match.result = match.result
    db_match.versus_team = match.versus_team
    db_match.players = match.players

    db.commit()
    db.refresh(db_match)
    return db_match

@router.delete("/{match_id}")
def delete_match(match_id: str, db: Session = Depends(get_db)):
    db_match = db.query(Match).filter(Match.id == match_id).first()
    if not db_match:
        raise HTTPException(status_code=404, detail="Match not found")
    db.delete(db_match)
    db.commit()
    return {"status": "deleted"}