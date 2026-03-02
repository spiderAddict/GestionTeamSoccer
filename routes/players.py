from fastapi import APIRouter, Depends, HTTPException
from typing import List
from database import get_db
from models.player import Player
from sqlalchemy.orm import Session
from pydantic import BaseModel

router = APIRouter(
    prefix="/api/players",
    tags=["players"]
)

# Schema Pydantic pour requêtes/réponses
class PlayerSchema(BaseModel):
    id: str
    first_name: str
    last_name: str
    email: str | None = None
    phone_number: str | None = None
    additional_info: str | None = None
    team: str | None = None

    model_config = {
        "from_attributes": True  # permet de générer à partir d'un objet SQLAlchemy
    }
    
# --- Schéma utilisé pour la création (pas d'id) ---
class PlayerCreate(BaseModel):
    first_name: str
    last_name: str
    email: str | None = None
    phone_number: str | None = None
    additional_info: str | None = None
    team: str | None = None

# --- CRUD ---
# --- Routes ---
@router.get("", response_model=List[PlayerSchema])
def get_players(db: Session = Depends(get_db)):
    return db.query(Player).all()

@router.post("", response_model=PlayerSchema)
def create_player(player: PlayerCreate, db: Session = Depends(get_db)):
    db_player = Player(
        first_name=player.first_name,
        last_name=player.last_name,
        email=player.email,
        phone_number=player.phone_number,
        additional_info=player.additional_info)
    db.add(db_player)
    db.commit()
    db.refresh(db_player)
    return db_player

@router.get("/{player_id}", response_model=PlayerSchema)
def get_player(player_id: str, db: Session = Depends(get_db)):
    db_player = db.query(Player).filter(Player.id == player_id).first()
    if not db_player:
        raise HTTPException(status_code=404, detail="Player not found")
    return db_player

@router.put("/{player_id}", response_model=PlayerSchema)
def update_player(player_id: str, player: PlayerSchema, db: Session = Depends(get_db)):
    db_player = db.query(Player).filter(Player.id == player_id).first()
    if not db_player:
        raise HTTPException(status_code=404, detail="Player not found")
    db_player.first_name = player.first_name
    db_player.last_name = player.last_name
    db_player.email = player.email
    db_player.phone_number = player.phone_number
    db_player.additional_info = player.additional_info
    db.commit()
    db.refresh(db_player)
    return db_player

@router.delete("/{player_id}")
def delete_player(player_id: str, db: Session = Depends(get_db)):
    db_player = db.query(Player).filter(Player.id == player_id).first()
    if not db_player:
        raise HTTPException(status_code=404, detail="Player not found")
    db.delete(db_player)
    db.commit()
    return {"status": "deleted"}