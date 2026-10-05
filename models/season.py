from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column
from database import Base


class Season(Base):
    __tablename__ = "season"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(50), nullable=False, unique=True)