import uuid
from sqlalchemy import String, Text
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import JSON
from database import Base

class Match(Base):

    __tablename__ = "match"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        nullable=False
    )
    date: Mapped[str] = mapped_column(String(10), nullable=False)  # stocké en ISO YYYY-MM-DD
    result: Mapped[str | None] = mapped_column(String(20), nullable=True)
    versus_team: Mapped[str | None] = mapped_column(String(20), nullable=True)
    players: Mapped[list] = mapped_column(JSON, nullable=False)  # liste des UUIDs des joueurs
    additional_info: Mapped[str | None] = mapped_column(Text, nullable=True)  # facultatif