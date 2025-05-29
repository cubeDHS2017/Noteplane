from fastapi import FastAPI
from database import init_db

app = FastAPI()

init_db()

@app.get("/")
def read_root():
    return {"message": "Welcome to Noteplane!"}

@app.get("/cards")
def read_cards():
    return [
        {"id": 1, "text": "First Note", "x_pos": 100, "y_pos": 150},
        {"id": 2, "text": "Second Note", "x_pos": 200, "y_pos": 300}
    ]

