import pygame
from constants import (screen, ROWS, COLS, SQUARE_SIZE, LIGHT_SQUARE, DARK_SQUARE, HIGHLIGHT,
                      MOVE_HIGHLIGHT, LAST_MOVE, CHECK_HIGHLIGHT, WHITE, BLACK, WIDTH, HEIGHT,
                      font, message_font)

def draw_board(game_state):
    for row in range(ROWS):
        for col in range(COLS):
            color = LIGHT_SQUARE if (row + col) % 2 == 0 else DARK_SQUARE
            pygame.draw.rect(screen, color, (col * SQUARE_SIZE, row * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE))
    
    if game_state.selected_piece:
        row, col = game_state.selected_piece
        pygame.draw.rect(screen, HIGHLIGHT, (col * SQUARE_SIZE, row * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE))
        
        for move_row, move_col in game_state.valid_moves:
            s = pygame.Surface((SQUARE_SIZE, SQUARE_SIZE), pygame.SRCALPHA)
            pygame.draw.circle(s, MOVE_HIGHLIGHT, (SQUARE_SIZE // 2, SQUARE_SIZE // 2), SQUARE_SIZE // 4)
            screen.blit(s, (move_col * SQUARE_SIZE, move_row * SQUARE_SIZE))
    
    if game_state.last_move:
        (start_row, start_col), (end_row, end_col) = game_state.last_move
        s = pygame.Surface((SQUARE_SIZE, SQUARE_SIZE), pygame.SRCALPHA)
        pygame.draw.rect(s, LAST_MOVE, (0, 0, SQUARE_SIZE, SQUARE_SIZE))
        screen.blit(s, (start_col * SQUARE_SIZE, start_row * SQUARE_SIZE))
        screen.blit(s, (end_col * SQUARE_SIZE, end_row * SQUARE_SIZE))
    
    for team in ['white', 'black']:
        if game_state.check[team]:
            for row in range(ROWS):
                for col in range(COLS):
                    piece = game_state.board[row][col]
                    if piece and piece.team == team and piece.type == 'king':
                        s = pygame.Surface((SQUARE_SIZE, SQUARE_SIZE), pygame.SRCALPHA)
                        pygame.draw.rect(s, CHECK_HIGHLIGHT, (0, 0, SQUARE_SIZE, SQUARE_SIZE))
                        screen.blit(s, (col * SQUARE_SIZE, row * SQUARE_SIZE))
                        break

def draw_pieces(game_state):
    for row in range(ROWS):
        for col in range(COLS):
            piece = game_state.board[row][col]
            if piece:
                text_color = WHITE if piece.team == 'white' else BLACK
                if piece.type == 'pawn':
                    text = 'P'
                elif piece.type == 'knight':
                    text = 'N'
                elif piece.type == 'bishop':
                    text = 'B'
                elif piece.type == 'rook':
                    text = 'R'
                elif piece.type == 'queen':
                    text = 'Q'
                elif piece.type == 'king':
                    text = 'K'
                
                text_surface = font.render(text, True, BLACK if piece.team == 'black' else WHITE)
                text_rect = text_surface.get_rect(center=(col * SQUARE_SIZE + SQUARE_SIZE // 2, 
                                                         row * SQUARE_SIZE + SQUARE_SIZE // 2))
                screen.blit(text_surface, text_rect)

def draw_game_state(game_state):
    turn_text = f"{'White' if game_state.turn == 'white' else 'Black'}'s turn"
    if game_state.ai_thinking:
        turn_text += " (AI thinking...)"
    turn_surface = message_font.render(turn_text, True, BLACK)
    screen.blit(turn_surface, (10, HEIGHT - 30))
    
    if game_state.game_over:
        s = pygame.Surface((WIDTH, HEIGHT), pygame.SRCALPHA)
        pygame.draw.rect(s, (0, 0, 0, 128), (0, 0, WIDTH, HEIGHT))
        screen.blit(s, (0, 0))
        
        message_surface = font.render(game_state.message, True, WHITE)
        message_rect = message_surface.get_rect(center=(WIDTH // 2, HEIGHT // 2))
        screen.blit(message_surface, message_rect)
        
        restart_surface = message_font.render("Press R to restart", True, WHITE)
        restart_rect = restart_surface.get_rect(center=(WIDTH // 2, HEIGHT // 2 + 50))
        screen.blit(restart_surface, restart_rect)