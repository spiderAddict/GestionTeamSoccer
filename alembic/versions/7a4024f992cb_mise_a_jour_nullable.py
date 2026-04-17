"""Mise a jour nullable

Revision ID: 7a4024f992cb
Revises: c8d334100933
Create Date: 2026-03-05 21:38:33.057640

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = '7a4024f992cb'
down_revision: Union[str, Sequence[str], None] = 'c8d334100933'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # rendre la colonne "email" nullable
    with op.batch_alter_table("player") as batch_op:
        batch_op.alter_column(
            'last_name',
            existing_type=sa.VARCHAR(length=50),
            nullable=True
        )

def downgrade() -> None:
    # revenir en non nullable si besoin
    with op.batch_alter_table("player") as batch_op:
        batch_op.alter_column(
            'last_name',
            existing_type=sa.VARCHAR(length=50),
            nullable=False
        )
