"""Rename player columns

Revision ID: 2f8b9c7d4a61
Revises: 7a4024f992cb
Create Date: 2026-04-08 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import sqlite

# revision identifiers, used by Alembic.
revision: str = '2f8b9c7d4a61'
down_revision: Union[str, Sequence[str], None] = '7a4024f992cb'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    with op.batch_alter_table("player") as batch_op:
        batch_op.alter_column(
            'first_name',
            new_column_name='name',
            existing_type=sa.VARCHAR(length=50),
            nullable=False
        )
        batch_op.alter_column(
            'last_name',
            new_column_name='surname',
            existing_type=sa.VARCHAR(length=50),
            nullable=True
        )


def downgrade() -> None:
    with op.batch_alter_table("player") as batch_op:
        batch_op.alter_column(
            'name',
            new_column_name='first_name',
            existing_type=sa.VARCHAR(length=50),
            nullable=False
        )
        batch_op.alter_column(
            'surname',
            new_column_name='last_name',
            existing_type=sa.VARCHAR(length=50),
            nullable=True
        )
