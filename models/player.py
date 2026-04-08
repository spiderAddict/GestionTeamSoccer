import uuid
from sqlalchemy import Text, String
from sqlalchemy.orm import Mapped, mapped_column
from database import Base

class Player(Base):

    __tablename__ = "player"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()), 
        nullable=False
    )
    name: Mapped[str] = mapped_column("name", String(50), nullable=False)
    surname: Mapped[str | None] = mapped_column("surname", String(50), nullable=True)
    email: Mapped[str | None] = mapped_column(String(100), nullable=True)
    phone_number: Mapped[str | None]  = mapped_column(String(15), nullable=True)
    additional_info: Mapped[str | None] = mapped_column(Text, nullable=True)