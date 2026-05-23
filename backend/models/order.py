from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, Text

from db.base import Base


class Order(Base):
    __tablename__ = "orders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("Rahul.id"), nullable=False, index=True)
    order_id = Column(String, unique=True, index=True, nullable=False)
    items = Column(Text, nullable=False)
    address = Column(Text, nullable=False)
    totals = Column(Text, nullable=False)
    payment_method = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
