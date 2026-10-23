"""Add closed_at to season (open / closed seasons)

Revision ID: 5c1e7f3a9b02
Revises: 4ab16d8e9c20
Create Date: 2026-10-23 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = '5c1e7f3a9b02'
down_revision: Union[str, Sequence[str], None] = '4ab16d8e9c20'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    with op.batch_alter_table('season') as batch_op:
        batch_op.add_column(sa.Column('closed_at', sa.DateTime(timezone=True), nullable=True))

    op.execute("UPDATE season SET name = 'Printemps 2026' WHERE name = 'Printemp 2026'")
    # Seule la saison la plus récente reste en cours
    op.execute("UPDATE season SET closed_at = CURRENT_TIMESTAMP WHERE id <> (SELECT MAX(id) FROM season)")


def downgrade() -> None:
    op.execute("UPDATE season SET name = 'Printemp 2026' WHERE name = 'Printemps 2026'")

    with op.batch_alter_table('season') as batch_op:
        batch_op.drop_column('closed_at')
