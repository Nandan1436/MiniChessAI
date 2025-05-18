'use client';

import { memo } from 'react';
import { GameState } from './types';

interface ChessBoardProps {
  gameState: GameState;
  onSelectPiece: (row: number, col: number) => void;
  onMove: (start_row: number, start_col: number, end_row: number, end_col: number) => void;
  isAIThinking: boolean;
}

function ChessBoard({ gameState, onSelectPiece, onMove, isAIThinking }: ChessBoardProps) {
  const moveSound = typeof Audio !== 'undefined' ? new Audio('/move.wav') : null;
  const getPieceSymbol = (piece: GameState['board'][0][0]) => {
    if (!piece) return '\u00A0'; // Non-breaking space
    const symbols: Record<string, { white: string; black: string }> = {
      pawn: { white: '♙', black: '♟' },
      knight: { white: '♘', black: '♞' },
      bishop: { white: '♗', black: '♝' },
      rook: { white: '♖', black: '♜' },
      queen: { white: '♕', black: '♛' },
      king: { white: '♔', black: '♚' },
    };
    return symbols[piece.type]?.[piece.team as 'white' | 'black'] || '\u00A0';
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
    if (isAIThinking || gameState.ai_thinking || gameState.game_over) return;
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

  return (
    <div className={`chessboard mx-auto ${isAIThinking || gameState.ai_thinking ? 'disabled' : ''}`}>
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
            dangerouslySetInnerHTML={{ __html: getPieceSymbol(piece) }}
          />
        ))
      )}
    </div>
  );
}

export default memo(ChessBoard);