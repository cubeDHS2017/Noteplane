from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class CardBase(BaseModel):
    text: str
    x_pos: float
    y_pos: float
    width: Optional[float] = 200
    height: Optional[float] = 100

class CardCreate(CardBase):
    pass

class Card(CardBase):
    id: int
    created_at: Optional[datetime]
    updated_at: Optional[datetime]

class Config:
    orm_mode = True
