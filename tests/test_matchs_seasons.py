from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from models import Match, Season
from tests.conftest import make_match, make_player


def _three_players(db: Session) -> list[str]:
    return [make_player(db, name).id for name in ("Alice", "Bob", "Chloé")]


def test_get_matchs_defaults_to_current(client: TestClient, db: Session, seasons: tuple[Season, Season]) -> None:
    players = _three_players(db)
    make_match(db, 1, players, "2026-05-01")
    autumn_match = make_match(db, 2, players, "2026-10-01")

    response = client.get("/api/matchs")

    assert response.status_code == 200
    assert [m["id"] for m in response.json()] == [autumn_match.id]


def test_get_matchs_by_season_id(client: TestClient, db: Session, seasons: tuple[Season, Season]) -> None:
    players = _three_players(db)
    spring_match = make_match(db, 1, players, "2026-05-01")
    make_match(db, 2, players, "2026-10-01")

    response = client.get("/api/matchs", params={"season_id": 1})

    assert response.status_code == 200
    assert [m["id"] for m in response.json()] == [spring_match.id]


def test_get_matchs_unknown_season_404(client: TestClient, seasons: tuple[Season, Season]) -> None:
    response = client.get("/api/matchs", params={"season_id": 999})

    assert response.status_code == 404


def test_create_match_goes_to_current_season(client: TestClient, db: Session, seasons: tuple[Season, Season]) -> None:
    players = _three_players(db)

    response = client.post("/api/matchs", json={"date": "2026-10-20", "players": players})

    assert response.status_code == 200
    assert response.json()["season_id"] == 2


def test_update_match_closed_season_409(client: TestClient, db: Session, seasons: tuple[Season, Season]) -> None:
    players = _three_players(db)
    spring_match = make_match(db, 1, players, "2026-05-01")

    response = client.put(f"/api/matchs/{spring_match.id}", json={"date": "2026-05-02", "players": players})

    assert response.status_code == 409
    db.expire_all()
    assert db.get(Match, spring_match.id).date == "2026-05-01"


def test_delete_match_closed_season_409(client: TestClient, db: Session, seasons: tuple[Season, Season]) -> None:
    players = _three_players(db)
    spring_match = make_match(db, 1, players, "2026-05-01")

    response = client.delete(f"/api/matchs/{spring_match.id}")

    assert response.status_code == 409
    db.expire_all()
    assert db.get(Match, spring_match.id) is not None


def test_update_match_current_season_ok(client: TestClient, db: Session, seasons: tuple[Season, Season]) -> None:
    players = _three_players(db)
    autumn_match = make_match(db, 2, players, "2026-10-01")

    response = client.put(f"/api/matchs/{autumn_match.id}", json={"date": "2026-10-02", "players": players})

    assert response.status_code == 200
    assert response.json()["date"] == "2026-10-02"
