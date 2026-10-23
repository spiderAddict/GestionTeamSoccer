from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from models import Payment, Player, Season
from tests.conftest import make_match, make_player


def test_delete_player_in_closed_match_409(client: TestClient, db: Session, seasons: tuple[Season, Season]) -> None:
    players = [make_player(db, name).id for name in ("Alice", "Bob", "Chloé")]
    make_match(db, 1, players, "2026-05-01")

    response = client.delete(f"/api/players/{players[0]}")

    assert response.status_code == 409
    db.expire_all()
    assert db.get(Player, players[0]) is not None


def test_delete_player_only_in_closed_payment_409(client: TestClient, db: Session, seasons: tuple[Season, Season]) -> None:
    payer = make_player(db, "Alice")
    receiver = make_player(db, "Bob")
    db.add(Payment(season_id=1, payer_id=payer.id, receiver_id=receiver.id, number_of_matches_paid=1))
    db.commit()

    response = client.delete(f"/api/players/{payer.id}")

    assert response.status_code == 409


def test_delete_player_only_in_current_season_ok(client: TestClient, db: Session, seasons: tuple[Season, Season]) -> None:
    players = [make_player(db, name).id for name in ("Alice", "Bob", "Chloé")]
    make_match(db, 2, players, "2026-10-01")

    response = client.delete(f"/api/players/{players[0]}")

    assert response.status_code == 200
    db.expire_all()
    assert db.get(Player, players[0]) is None


def test_delete_player_unused_ok(client: TestClient, db: Session, seasons: tuple[Season, Season]) -> None:
    player = make_player(db, "Alice")

    response = client.delete(f"/api/players/{player.id}")

    assert response.status_code == 200
