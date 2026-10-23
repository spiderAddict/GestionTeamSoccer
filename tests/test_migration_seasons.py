import os
import sqlite3
from pathlib import Path

from alembic import command
from alembic.config import Config

BASE_DIR = Path(__file__).resolve().parent.parent


def _alembic_config(db_path: Path) -> Config:
    cfg = Config(os.path.join(BASE_DIR, "alembic.ini"))
    cfg.set_main_option("sqlalchemy.url", f"sqlite:///{db_path.as_posix()}")
    return cfg


def test_upgrade_closes_old_seasons_and_fixes_name(tmp_path: Path) -> None:
    db_path = tmp_path / "t.db"
    cfg = _alembic_config(db_path)
    command.upgrade(cfg, "4ab16d8e9c20")
    command.upgrade(cfg, "head")

    with sqlite3.connect(db_path) as conn:
        rows = conn.execute("SELECT name, closed_at FROM season ORDER BY id").fetchall()

    assert [name for name, _ in rows] == ["Printemps 2026", "Automne 2026"]
    assert rows[0][1] is not None
    assert rows[1][1] is None


def test_downgrade_restores_previous_schema(tmp_path: Path) -> None:
    db_path = tmp_path / "t.db"
    cfg = _alembic_config(db_path)
    command.upgrade(cfg, "head")
    command.downgrade(cfg, "4ab16d8e9c20")

    with sqlite3.connect(db_path) as conn:
        columns = [row[1] for row in conn.execute("PRAGMA table_info(season)").fetchall()]
        names = [row[0] for row in conn.execute("SELECT name FROM season ORDER BY id").fetchall()]

    assert "closed_at" not in columns
    assert names == ["Printemp 2026", "Automne 2026"]
