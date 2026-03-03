import uuid
from sqlalchemy import Column, String, Date, Text
from sqlalchemy.dialects.postgresql import JSON
from database import Base

class Match(Base):
    __tablename__ = "match"

    id: str = Column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        nullable=False
    )
    date: str = Column(String(10), nullable=False)  # stocké en ISO YYYY-MM-DD
    result: str | None = Column(String(20), nullable=True)
    players: list = Column(JSON, nullable=False)  # liste des UUIDs des joueurs
    additional_info: str | None = Column(Text, nullable=True)  # facultatif