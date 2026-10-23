from fastapi.testclient import TestClient
from sqlalchemy.orm import Session

from models import Season


def test_list_seasons_current_first(client: TestClient, seasons: tuple[Season, Season]) -> None:
    response = client.get("/api/seasons")

    assert response.status_code == 200
    body = response.json()
    assert [(s["name"], s["is_current"]) for s in body] == [
        ("Automne 2026", True),
        ("Printemps 2026", False),
    ]
    assert body[0]["closed_at"] is None
    assert body[1]["closed_at"] is not None


def test_create_season_closes_current(client: TestClient, db: Session, seasons: tuple[Season, Season]) -> None:
    response = client.post("/api/seasons", json={"name": "Printemps 2027"})

    assert response.status_code == 200
    assert response.json()["name"] == "Printemps 2027"
    assert response.json()["is_current"] is True

    listed = client.get("/api/seasons").json()
    assert len(listed) == 3
    assert [s["name"] for s in listed if s["is_current"]] == ["Printemps 2027"]
    autumn = next(s for s in listed if s["name"] == "Automne 2026")
    assert autumn["closed_at"] is not None


def test_create_season_strips_name(client: TestClient, seasons: tuple[Season, Season]) -> None:
    response = client.post("/api/seasons", json={"name": "  Été 2027  "})

    assert response.status_code == 200
    assert response.json()["name"] == "Été 2027"


def test_create_season_blank_name_400(client: TestClient, seasons: tuple[Season, Season]) -> None:
    response = client.post("/api/seasons", json={"name": "   "})

    assert response.status_code == 400


def test_create_season_too_long_400(client: TestClient, seasons: tuple[Season, Season]) -> None:
    response = client.post("/api/seasons", json={"name": "x" * 51})

    assert response.status_code == 400


def test_create_season_duplicate_name_keeps_current_open(client: TestClient, seasons: tuple[Season, Season]) -> None:
    response = client.post("/api/seasons", json={"name": "Automne 2026"})

    assert response.status_code == 409
    listed = client.get("/api/seasons").json()
    assert [s["name"] for s in listed if s["is_current"]] == ["Automne 2026"]
