from fastapi import APIRouter, HTTPException
from ..services.game_service import GameService
from ..schemas.game import GameStateSchema, MoveSchema

router = APIRouter()
game_service = GameService()

@router.post("/game/init", response_model=GameStateSchema)
async def init_game(mode: str = "ai", ai_depth: int = 2):
    if mode not in ["ai", "human"]:
        raise HTTPException(status_code=400, detail="Mode must be 'ai' or 'human'")
    return game_service.init_game(mode, ai_depth)

@router.post("/game/select", response_model=GameStateSchema)
async def select_piece(position: dict):
    row, col = position.get("row"), position.get("col")
    if not (isinstance(row, int) and isinstance(col, int) and 0 <= row < 6 and 0 <= col < 5):
        raise HTTPException(status_code=400, detail="Invalid position")
    return game_service.select_piece(row, col)

@router.post("/game/move", response_model=GameStateSchema)
async def make_move(move: MoveSchema):
    return game_service.make_move(move.start_row, move.start_col, move.end_row, move.end_col)

@router.post("/game/ai_move", response_model=GameStateSchema)
async def make_ai_move():
    return game_service.make_ai_move()

@router.get("/game/state", response_model=GameStateSchema)
async def get_game_state():
    return game_service.get_game_state()
