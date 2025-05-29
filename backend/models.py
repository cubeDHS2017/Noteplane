from sqlalchemy import Column, Integer, Float, Text, ForeignKey, DateTime, func
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Card(Base):
    __tablename__ = "cards"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(Text, nullable=False)
    x_pos = Column(Float, nullable=False)
    y_pos = Column(Float, nullable=False)
    width = Column(Float, default=200)
    height = Column(Float, default=100)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now(), server_default=func.now())

class Connection(Base):
    __tablename__ = "connections"

    id = Column(Integer, primary_key=True, index=True)
    from_card_id = Column(Integer, ForeignKey("cards.id", ondelete="CASCADE"))
    to_card_id = Column(Integer, ForeignKey("cards.id", ondelete="CASCADE"))
    type = Column(Text)
