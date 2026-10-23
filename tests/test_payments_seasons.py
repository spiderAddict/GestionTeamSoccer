from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from models import Payment, Season
from tests.conftest import make_match, make_player


def _setup(db: Session) -> tuple[str, str, str, str]:
    """Deux joueurs, un match de Printemps (clôturée) et un match d'Automne (en cours)."""
    payer = make_player(db, "Alice")
    receiver = make_player(db, "Bob")
    other = make_player(db, "Chloé")
    players = [payer.id, receiver.id, other.id]
    spring_match = make_match(db, 1, players, "2026-05-01")
    autumn_match = make_match(db, 2, players, "2026-10-01")
    return payer.id, receiver.id, spring_match.id, autumn_match.id


def _add_payment(db: Session, season_id: int, payer_id: str, receiver_id: str) -> Payment:
    payment = Payment(season_id=season_id, payer_id=payer_id, receiver_id=receiver_id, number_of_matches_paid=1)
    db.add(payment)
    db.commit()
    return payment


def test_get_payments_by_season_id(client: TestClient, db: Session, seasons: tuple[Season, Season]) -> None:
    payer_id, receiver_id, _, _ = _setup(db)
    spring_payment = _add_payment(db, 1, payer_id, receiver_id)
    autumn_payment = _add_payment(db, 2, payer_id, receiver_id)

    default = client.get("/api/payments")
    spring = client.get("/api/payments", params={"season_id": 1})

    assert [p["id"] for p in default.json()] == [autumn_payment.id]
    assert [p["id"] for p in spring.json()] == [spring_payment.id]


def test_create_payment_on_closed_season(client: TestClient, db: Session, seasons: tuple[Season, Season]) -> None:
    payer_id, receiver_id, spring_match_id, _ = _setup(db)

    response = client.post(
        "/api/payments",
        params={"season_id": 1},
        json={"payer_id": payer_id, "receiver_id": receiver_id, "number_of_matches_paid": 1, "match_ids": [spring_match_id]},
    )

    assert response.status_code == 200
    assert response.json()["season_id"] == 1
    assert response.json()["match_ids"] == [spring_match_id]


def test_create_payment_closed_season_rejects_foreign_match(client: TestClient, db: Session, seasons: tuple[Season, Season]) -> None:
    payer_id, receiver_id, _, autumn_match_id = _setup(db)

    response = client.post(
        "/api/payments",
        params={"season_id": 1},
        json={"payer_id": payer_id, "receiver_id": receiver_id, "number_of_matches_paid": 1, "match_ids": [autumn_match_id]},
    )

    assert response.status_code == 400


def test_delete_payment_closed_season_ok(client: TestClient, db: Session, seasons: tuple[Season, Season]) -> None:
    payer_id, receiver_id, _, _ = _setup(db)
    spring_payment = _add_payment(db, 1, payer_id, receiver_id)

    response = client.delete(f"/api/payments/{spring_payment.id}")

    assert response.status_code == 200
