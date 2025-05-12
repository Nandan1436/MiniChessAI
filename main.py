import pygame
import sys
from game_state import GameState
from ai import ChessAI
from render import draw_board, draw_pieces, draw_game_state
from constants import WIDTH, HEIGHT, ROWS, COLS, SQUARE_SIZE, WHITE, clock

pygame.init()
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption('MiniChess (6x5)')

def main():
    game_state = GameState()
    chess_ai = ChessAI(depth=3)
    
    running = True
    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            
            elif event.type == pygame.MOUSEBUTTONDOWN and not game_state.game_over and not game_state.ai_thinking:
                if game_state.turn == 'white':
                    mouse_pos = pygame.mouse.get_pos()
                    col = mouse_pos[0] // SQUARE_SIZE
                    row = mouse_pos[1] // SQUARE_SIZE
                    
                    if 0 <= row < ROWS and 0 <= col < COLS:
                        if game_state.selected_piece is None:
                            game_state.select_piece(row, col)
                        else:
                            selected_row, selected_col = game_state.selected_piece
                            if (row, col) in game_state.valid_moves:
                                game_state.move_piece(selected_row, selected_col, row, col)
                                if not game_state.game_over:
                                    chess_ai.make_move(game_state)
                            else:
                                if game_state.select_piece(row, col) is False:
                                    game_state.selected_piece = None
                                    game_state.valid_moves = []
            
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_r:
                    game_state = GameState()
        
        screen.fill(WHITE)
        draw_board(game_state)
        draw_pieces(game_state)
        draw_game_state(game_state)
        
        pygame.display.flip()
        clock.tick(60)
    
    pygame.quit()
    sys.exit()

if __name__ == "__main__":
    main()