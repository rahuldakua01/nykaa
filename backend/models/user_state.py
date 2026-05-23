from sqlalchemy import Column, ForeignKey, Integer, Text, UniqueConstraint

from db.base import Base


class UserState(Base):
    __tablename__ = "user_state"
    __table_args__ = (UniqueConstraint("user_id", name="uq_user_state_user_id"),)

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("Rahul.id"), nullable=False, index=True)
    cart = Column(Text, nullable=False, default="[]")
    wishlist = Column(Text, nullable=False, default="[]")
