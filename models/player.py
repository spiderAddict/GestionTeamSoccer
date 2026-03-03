import uuid
from sqlalchemy import Column, Text, String
from database import Base

class Player(Base):

    __tablename__ = "player"

    id: str = Column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()), 
        nullable=False
    )
    first_name: str = Column(String(50), nullable=False)
    last_name: str = Column(String(50), nullable=False)
    email: str | None = Column(String(100), nullable=True)
    phone_number: str | None  = Column(String(15), nullable=True)
    additional_info: str | None = Column(Text, nullable=True)