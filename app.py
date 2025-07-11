from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import uuid
import firebase_admin
from firebase_admin import credentials, db 
from fastapi.middleware.cors import CORSMiddleware

cred = credentials.Certificate("firebase_key.json")
firebase_admin.initialize_app(cred, {
    "databaseURL": "https://testesn3-e821b-default-rtdb.firebaseio.com"  
})

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Game(BaseModel):
    title: str
    genre: str
    year: int

class GameWithID(Game):
    id: str

GAMES_REF = db.reference("games")

@app.get("/games", response_model=List[GameWithID])
def list_games():
    data = GAMES_REF.get() or {}
    return [{"id": gid, **info} for gid, info in data.items()]

@app.get("/games/{game_id}", response_model=GameWithID)
def get_game(game_id: str):
    data = GAMES_REF.child(game_id).get()
    if not data:
        raise HTTPException(status_code=404, detail="Game not found")
    return {"id": game_id, **data}

@app.post("/games", response_model=GameWithID)
def create_game(game: Game):
    game_id = str(uuid.uuid4())
    GAMES_REF.child(game_id).set(game.dict())
    return {"id": game_id, **game.dict()}

@app.put("/games/{game_id}", response_model=GameWithID)
def update_game(game_id: str, game: Game):
    if not GAMES_REF.child(game_id).get():
        raise HTTPException(status_code=404, detail="Game not found")
    GAMES_REF.child(game_id).set(game.dict())
    return {"id": game_id, **game.dict()}

@app.delete("/games/{game_id}")
def delete_game(game_id: str):
    if not GAMES_REF.child(game_id).get():
        raise HTTPException(status_code=404, detail="Game not found")
    GAMES_REF.child(game_id).delete()
    return {"message": "Game deleted"}
