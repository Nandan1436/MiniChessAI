import pygame

pygame.init()

WIDTH, HEIGHT = 500, 600
BOARD_WIDTH, BOARD_HEIGHT = 500, 600
ROWS, COLS = 6, 5
SQUARE_SIZE = BOARD_WIDTH // COLS

WHITE = (255, 255, 255)
BLACK = (0, 0, 0)
DARK_SQUARE = (118, 150, 86)
LIGHT_SQUARE = (238, 238, 210)
HIGHLIGHT = (186, 202, 68)
MOVE_HIGHLIGHT = (119, 153, 245)
LAST_MOVE = (255, 255, 0, 128)
CHECK_HIGHLIGHT = (255, 0, 0, 128)

screen = pygame.display.set_mode((WIDTH, HEIGHT))
clock = pygame.time.Clock()
font = pygame.font.SysFont('Arial', 48)
message_font = pygame.font.SysFont('Arial', 24)