"""Add seasons and associate matches and payments

Revision ID: 4ab16d8e9c20
Revises: 2f8b9c7d4a61
Create Date: 2026-10-05 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = '4ab16d8e9c20'
down_revision: Union[str, Sequence[str], None] = '2f8b9c7d4a61'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        'season',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('name', sa.String(length=50), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('name')
    )
    op.bulk_insert(
        sa.table(
            'season',
            sa.column('id', sa.Integer()),
            sa.column('name', sa.String())
        ),
        [
            {'id': 1, 'name': 'Printemp 2026'},
            {'id': 2, 'name': 'Automne 2026'},
        ]
    )

    op.add_column('match', sa.Column('season_id', sa.Integer(), nullable=True))
    op.add_column('payment', sa.Column('season_id', sa.Integer(), nullable=True))
    op.execute('UPDATE "match" SET season_id = 1')
    op.execute('UPDATE payment SET season_id = 1')

    with op.batch_alter_table('match') as batch_op:
        batch_op.alter_column('season_id', existing_type=sa.Integer(), nullable=False)
        batch_op.create_foreign_key('fk_match_season_id_season', 'season', ['season_id'], ['id'])

    with op.batch_alter_table('payment') as batch_op:
        batch_op.alter_column('season_id', existing_type=sa.Integer(), nullable=False)
        batch_op.create_foreign_key('fk_payment_season_id_season', 'season', ['season_id'], ['id'])


def downgrade() -> None:
    with op.batch_alter_table('payment') as batch_op:
        batch_op.drop_constraint('fk_payment_season_id_season', type_='foreignkey')
        batch_op.drop_column('season_id')

    with op.batch_alter_table('match') as batch_op:
        batch_op.drop_constraint('fk_match_season_id_season', type_='foreignkey')
        batch_op.drop_column('season_id')

    op.drop_table('season')