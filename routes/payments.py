from fastapi import APIRouter, Depends, HTTPException
from typing import List
from database import get_db
from models import Payment, Player, Match
from sqlalchemy.orm import Session
from sqlalchemy import exists
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(
    prefix="/api/payments",
    tags=["payments"]
)

# =============================
# 📦 Schemas Pydantic
# =============================

class PaymentSchema(BaseModel):
    id: str
    payer_id: str
    receiver_id: str
    number_of_matches_paid: int
    created_at: datetime
    match_ids: List[str]

    model_config = {
        "from_attributes": True
    }


class PaymentCreate(BaseModel):
    payer_id: str
    receiver_id: str
    number_of_matches_paid: int
    match_ids: List[str]


# =============================
# 📌 Routes CRUD
# =============================

@router.get("", response_model=List[PaymentSchema])
def get_payments(db: Session = Depends(get_db))  -> List[PaymentSchema]:
    payments: List[Payment] = db.query(Payment).all()

    # transformer les matches en liste d'id
    result: List[PaymentSchema] = []
    for p in payments:
        result.append(
            PaymentSchema(
                id=p.id,
                payer_id=p.payer_id,
                receiver_id=p.receiver_id,
                number_of_matches_paid=p.number_of_matches_paid,
                created_at=p.created_at,
                match_ids=[m.id for m in p.matches]
            )
        )
    return result


@router.post("", response_model=PaymentSchema)
def create_payment(payment: PaymentCreate, db: Session = Depends(get_db)) -> PaymentSchema:

    # Vérifier que les matchs existent
    matches: List[Match] = db.query(Match).filter(Match.id.in_(payment.match_ids)).all()
    if len(matches) != len(payment.match_ids):
        raise HTTPException(status_code=400, detail="One or more matches not found")

    # Vérifier que les payers et receivers existent
    payer_exists = db.query(
        exists().where(Player.id == payment.payer_id)
    ).scalar()

    if not payer_exists:
        raise HTTPException(status_code=400, detail="Payer not found")

    receiver_exists = db.query(
        exists().where(Player.id == payment.receiver_id)
    ).scalar()

    if not receiver_exists :
        raise HTTPException(status_code=400, detail="Receiver not found")    

    db_payment = Payment(
        payer_id=payment.payer_id,
        receiver_id=payment.receiver_id,
        number_of_matches_paid=payment.number_of_matches_paid
    )

    db_payment.matches = matches

    db.add(db_payment)
    db.commit()
    db.refresh(db_payment)

    return PaymentSchema(
        id=db_payment.id,
        payer_id=db_payment.payer_id,
        receiver_id=db_payment.receiver_id,
        number_of_matches_paid=db_payment.number_of_matches_paid,
        created_at=db_payment.created_at,
        match_ids=[m.id for m in db_payment.matches]
    )


@router.get("/{payment_id}", response_model=PaymentSchema)
def get_payment(payment_id: str, db: Session = Depends(get_db)) -> PaymentSchema:
    db_payment: Payment | None = db.query(Payment).filter(Payment.id == payment_id).first()
    if not db_payment:
        raise HTTPException(status_code=404, detail="Payment not found")

    return PaymentSchema(
        id=db_payment.id,
        payer_id=db_payment.payer_id,
        receiver_id=db_payment.receiver_id,
        number_of_matches_paid=db_payment.number_of_matches_paid,
        created_at=db_payment.created_at,
        match_ids=[m.id for m in db_payment.matches]
    )


@router.delete("/{payment_id}")
def delete_payment(payment_id: str, db: Session = Depends(get_db)) -> dict[str, str]:
    db_payment: Payment | None = db.query(Payment).filter(Payment.id == payment_id).first()
    if not db_payment:
        raise HTTPException(status_code=404, detail="Payment not found")

    db.delete(db_payment)
    db.commit()
    return {"status": "deleted"}