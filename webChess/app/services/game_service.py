
from ..models.game_state import GameState
from ..models.chess_ai import ChessAI
from ..schemas.game import GameStateSchema

class GameService:
    def __init__(self):
        self.game_state = GameState()
        self.chess_ai = ChessAI(depth=2)
        self.mode = "ai"  # Track game mode
        self.ai_depth = 2  # Track AI depth

    def init_game(self, mode: str = "ai", ai_depth: int = 2) -> GameStateSchema:
        self.mode = mode
        self.ai_depth = ai_depth
        self.chess_ai = ChessAI(depth=ai_depth) if mode == "ai" else None
        self.game_state = GameState()
        return GameStateSchema.from_orm(self.game_state)

    def select_piece(self, row: int, col: int) -> GameStateSchema:
        success = self.game_state.select_piece(row, col)
        if not success:
            self.game_state.message = "Invalid piece selection"
        return GameStateSchema.from_orm(self.game_state)

    def make_move(self, start_row: int, start_col: int, end_row: int, end_col: int) -> GameStateSchema:
        if self.game_state.ai_thinking or self.game_state.game_over:
            self.game_state.message = "Invalid move: Game is processing or over"
            return GameStateSchema.from_orm(self.game_state)

        if self.game_state.selected_piece != (start_row, start_col):
            self.game_state.message = "Piece not selected"
            return GameStateSchema.from_orm(self.game_state)

        if (end_row, end_col) not in self.game_state.valid_moves:
            self.game_state.message = "Invalid move"
            return GameStateSchema.from_orm(self.game_state)

        piece = self.game_state.board[start_row][start_col]
        if not piece or piece.team != self.game_state.turn:
            self.game_state.message = "Invalid move: Not your turn"
            return GameStateSchema.from_orm(self.game_state)

        self.game_state.move_piece(start_row, start_col, end_row, end_col)
        return GameStateSchema.from_orm(self.game_state)

    def make_ai_move(self) -> GameStateSchema:
        if self.mode != "ai" or self.game_state.turn != 'black' or self.game_state.ai_thinking or self.game_state.game_over or not self.chess_ai:
            self.game_state.message = "Invalid AI move request"
            return GameStateSchema.from_orm(self.game_state)

        best_move = self.chess_ai.make_move(self.game_state)
        response = GameStateSchema.from_orm(self.game_state)
        response.nodes_evaluated = self.chess_ai.nodes_evaluated
        return response

    def get_game_state(self) -> GameStateSchema:
        return GameStateSchema.from_orm(self.game_state)
