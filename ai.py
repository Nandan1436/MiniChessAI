import random
import time
import threading
from copy import deepcopy
from constants import ROWS, COLS

class ChessAI:
    def __init__(self, depth=3):
        self.depth = depth
    
    def evaluate_board(self, board):
        score = 0
        for row in range(ROWS):
            for col in range(COLS):
                piece = board[row][col]
                if piece:
                    multiplier = 1 if piece.team == 'black' else -1
                    score += multiplier * piece.value
                    if piece.type == 'pawn':
                        if piece.team == 'black':
                            score += multiplier * 0.1 * row
                        else:
                            score += multiplier * 0.1 * (ROWS - 1 - row)
                    if 1 <= row <= 4 and 1 <= col <= 3:
                        score += multiplier * 0.05
                    if piece.type == 'knight':
                        center_dist = abs(2.5 - col) + abs(2.5 - row)
                        score += multiplier * (5 - center_dist) * 0.05
        return score
    
    def minimax(self, game_state, depth, alpha, beta, maximizing):
        if depth == 0 or game_state.game_over:
            return self.evaluate_board(game_state.board), None
        
        best_move = None
        if maximizing:
            max_eval = float('-inf')
            moves = game_state.get_all_possible_moves('black')
            random.shuffle(moves)
            
            for start, end in moves:
                new_state = deepcopy(game_state)
                new_state.move_piece(start[0], start[1], end[0], end[1])
                eval_score, _ = self.minimax(new_state, depth - 1, alpha, beta, False)
                
                if eval_score > max_eval:
                    max_eval = eval_score
                    best_move = (start, end)
                
                alpha = max(alpha, eval_score)
                if beta <= alpha:
                    break
            
            return max_eval, best_move
        
        else:
            min_eval = float('inf')
            moves = game_state.get_all_possible_moves('white')
            
            for start, end in moves:
                new_state = deepcopy(game_state)
                new_state.move_piece(start[0], start[1], end[0], end[1])
                eval_score, _ = self.minimax(new_state, depth - 1, alpha, beta, True)
                
                if eval_score < min_eval:
                    min_eval = eval_score
                    best_move = (start, end)
                
                beta = min(beta, eval_score)
                if beta <= alpha:
                    break
            
            return min_eval, best_move
    
    def make_move(self, game_state):
        game_state.ai_thinking = True
        
        def ai_worker():
            _, best_move = self.minimax(game_state, self.depth, float('-inf'), float('inf'), True)
            time.sleep(1)
            if best_move:
                start, end = best_move
                game_state.move_piece(start[0], start[1], end[0], end[1])
            game_state.ai_thinking = False
        
        threading.Thread(target=ai_worker).start()