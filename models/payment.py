import uuid
from datetime import datetime
from sqlalchemy import DateTime, Column, String, Integer, ForeignKey, CheckConstraint, Table
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.sql import func
from database import Base

# Table d'association Payment ↔ Match
payment_match_association = Table(
    "payment_match_association",
    Base.metadata,
    Column("payment_id", String(36), ForeignKey("payment.id", ondelete="CASCADE"), primary_key=True),
    Column("match_id", String(36), ForeignKey("match.id", ondelete="CASCADE"), primary_key=True),
)

class Payment(Base):
    
    __tablename__: str = "payment"

    id: Mapped[str] = mapped_column(
        String(36),
        primary_key=True,
        default=lambda: str(uuid.uuid4()),
        nullable=False
    )
    payer_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("player.id", ondelete="CASCADE"),
        nullable=False
    )
    receiver_id: Mapped[str] = mapped_column(
        String(36),
        ForeignKey("player.id", ondelete="CASCADE"),
        nullable=False
    )
    number_of_matches_paid: Mapped[int] = mapped_column(Integer, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    __table_args__ = (
        CheckConstraint("payer_id <> receiver_id", name="check_payer_not_receiver"),
        CheckConstraint("number_of_matches_paid > 0", name="check_positive_matches"),
    )

    # Relations
    payer = relationship("Player", foreign_keys=[payer_id])
    receiver = relationship("Player", foreign_keys=[receiver_id])
    matches = relationship("Match", secondary=payment_match_association, backref="payments")