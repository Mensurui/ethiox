"""Fixed the daily exchange table

Revision ID: 0d089bef5c01
Revises: a056d0a00f53
Create Date: 2024-08-16 02:17:16.079609

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '0d089bef5c01'
down_revision: Union[str, None] = 'a056d0a00f53'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('daily_exchangerate', sa.Column('transactional_buying_price', sa.Float(), nullable=False))
    op.add_column('daily_exchangerate', sa.Column('transactional_selling_price', sa.Float(), nullable=False))
    op.add_column('daily_exchangerate', sa.Column('cash_buying_price', sa.Float(), nullable=False))
    op.add_column('daily_exchangerate', sa.Column('cash_selling_price', sa.Float(), nullable=False))
    op.drop_column('daily_exchangerate', 'buying_price')
    op.drop_column('daily_exchangerate', 'selling_price')
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('daily_exchangerate', sa.Column('selling_price', sa.DOUBLE_PRECISION(precision=53), autoincrement=False, nullable=False))
    op.add_column('daily_exchangerate', sa.Column('buying_price', sa.DOUBLE_PRECISION(precision=53), autoincrement=False, nullable=False))
    op.drop_column('daily_exchangerate', 'cash_selling_price')
    op.drop_column('daily_exchangerate', 'cash_buying_price')
    op.drop_column('daily_exchangerate', 'transactional_selling_price')
    op.drop_column('daily_exchangerate', 'transactional_buying_price')
    # ### end Alembic commands ###
