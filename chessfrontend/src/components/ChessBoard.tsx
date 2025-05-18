'use client';

import { memo } from 'react';
import { GameState } from './types';

interface ChessBoardProps {
  gameState: GameState;
  onSelectPiece: (row: number, col: number) => void;
  onMove: (start_row: number, start_col: number, end_row: number, end_col: number) => void;
  isAIThinking: boolean;
  gameMode?: 'ai' | 'human' | 'ai_vs_ai';
}

function ChessBoard({ gameState, onSelectPiece, onMove, isAIThinking, gameMode }: ChessBoardProps) {
  const moveSound = typeof Audio !== 'undefined' ? new Audio('/move.wav') : null;

  const getPieceImage = (piece: GameState['board'][0][0]) => {
    if (!piece) return null;
    const images: Record<string, { white: string; black: string }> = {
      pawn: { white: '/white_pawn.png', black: '/black_pawn.png' },
      knight: { white: '/white_knight.png', black: '/black_knight.png' },
      bishop: { white: '/white_bishop.png', black: '/black_bishop.png' },
      rook: { white: '/white_rook.png', black: '/black_rook.png' },
      queen: { white: '/white_queen.png', black: '/black_queen.png' },
      king: { white: '/white_king.png', black: '/black_king.png' },
    };
    return images[piece.type]?.[piece.team as 'white' | 'black'] || null;
  };

  const isLastMove = (row: number, col: number) => {
    if (!gameState.last_move) return false;
    const [[start_row, start_col], [end_row, end_col]] = gameState.last_move;
    return (row === start_row && col === start_col) || (row === end_row && col === end_col);
  };

  const isInCheck = (row: number, col: number) => {
    const piece = gameState.board[row]?.[col];
    return piece && piece.type === 'king' && gameState.check[piece.team];
  };

  const handleClick = (row: number, col: number) => {
    if (gameMode === 'ai_vs_ai' || isAIThinking || gameState.ai_thinking || gameState.game_over) return;
    if (gameState.selected_piece) {
      const [start_row, start_col] = gameState.selected_piece;
      if (gameState.valid_moves.some(([r, c]) => r === row && c === col)) {
        onMove(start_row, start_col, row, col);
        if (moveSound) {
          moveSound.play().catch((error) => console.error('Failed to play move sound:', error));
        }
      } else {
        onSelectPiece(row, col);
      }
    } else {
      onSelectPiece(row, col);
    }
  };

  const isDisabled = gameMode === 'ai' && (isAIThinking || gameState.ai_thinking);

  return (
    <div className={`chessboard mx-auto ${isDisabled ? 'disabled' : ''}`}>
      {gameState.board.map((row, rowIndex) =>
        row.map((piece, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`square ${rowIndex % 2 === colIndex % 2 ? 'light-square' : 'dark-square'} ${
              gameState.selected_piece &&
              gameState.selected_piece[0] === rowIndex &&
              gameState.selected_piece[1] === colIndex
                ? 'selected'
                : ''
            } ${
              gameState.valid_moves.some(([r, c]) => r === rowIndex && c === colIndex) ? 'valid-move' : ''
            } ${isLastMove(rowIndex, colIndex) ? 'last-move' : ''} ${isInCheck(rowIndex, colIndex) ? 'check' : ''}`}
            onClick={() => handleClick(rowIndex, colIndex)}
          >
            <div className="piece">
              {piece && (
                <img
                  src={getPieceImage(piece)!}
                  alt={`${piece.team} ${piece.type}`}
                  className="piece-image"
                />
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default memo(ChessBoard);

