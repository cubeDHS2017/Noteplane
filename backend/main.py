from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal, init_db
from models import Card as CardModel
from schemas import Card as CardSchema, CardCreate
from fastapi.middleware.cors import CORSMiddleware
from schemas import CardUpdate

app = FastAPI()

init_db()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "Welcome to Noteplane!"}

@app.get("/cards", response_model=list[CardSchema])
def read_cards(db: Session = Depends(get_db)):
    return db.query(CardModel).all()

@app.post("/cards", response_model=CardSchema)
def create_card(card: CardCreate, db: Session = Depends(get_db)):
    db_card = CardModel(**card.dict())
    db.add(db_card)
    db.commit()
    db.refresh(db_card)
    return db_card


@app.get("/test")
def read_cards():
    return [
        {"id": 1, "text": "First Note", "x_pos": 100, "y_pos": 150},
        {"id": 2, "text": "Second Note", "x_pos": 200, "y_pos": 300}
    ]


@app.put("/cards/{card_id}", response_model=CardSchema)
def update_card(card_id: int, card: CardUpdate, db: Session = Depends(get_db)):
    db_card = db.query(CardModel).filter(CardModel.id == card_id).first()
    if db_card is None:
        raise HTTPException(status_code=404, detail="Card not found")
    db_card.x_pos = card.x_pos
    db_card.y_pos = card.y_pos
    db.commit()
    db.refresh(db_card)
    return db_card




# Allow frontend in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # or your domain in prod
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
