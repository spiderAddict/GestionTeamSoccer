from datetime import datetime, timezone
from typing import Iterator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from database import Base, get_db
from main import app
from models import Match, Player, Season


@pytest.fixture
def db() -> Iterator[Session]:
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(engine)
    session = sessionmaker(autocommit=False, autoflush=False, bind=engine)()
    try:
        yield session
    finally:
        session.close()
        engine.dispose()


@pytest.fixture
def client(db: Session) -> Iterator[TestClient]:
    app.dependency_overrides[get_db] = lambda: db
    try:
        yield TestClient(app)
    finally:
        app.dependency_overrides.clear()


@pytest.fixture
def seasons(db: Session) -> tuple[Season, Season]:
    closed = Season(id=1, name="Printemps 2026", closed_at=datetime(2026, 7, 1, tzinfo=timezone.utc))
    current = Season(id=2, name="Automne 2026")
    db.add_all([closed, current])
    db.commit()
    return closed, current


def make_player(db: Session, name: str) -> Player:
    player = Player(name=name)
    db.add(player)
    db.commit()
    return player


def make_match(db: Session, season_id: int, players: list[str], date: str = "2026-10-01") -> Match:
    match = Match(season_id=season_id, date=date, players=players)
    db.add(match)
    db.commit()
    return match
