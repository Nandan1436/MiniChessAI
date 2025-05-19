'use client';

import { useEffect } from 'react';
import { GameState } from '../lib/api';
import './GameStatus.css';

interface GameStatusProps {
  gameState: GameState;
  onRestart: () => void;
  isAIThinking: boolean;
  gameMode: 'ai' | 'human' | 'ai_vs_ai';
}

export default function GameStatus({ gameState, onRestart, isAIThinking, gameMode }: GameStatusProps) {
  const isCheckmate = gameState.message?.toLowerCase().includes('checkmate');
  const isStalemate = gameState.message?.toLowerCase().includes('stalemate');
  const checkmateSound = typeof Audio !== 'undefined' ? new Audio('/checkmate.wav') : null;

  useEffect(() => {
    if (isCheckmate && checkmateSound) {
      checkmateSound.play().catch((error) => console.error('Failed to play checkmate sound:', error));
    }
  }, [isCheckmate, checkmateSound]);

  const handleRetry = () => {
    onRestart();
  };

  const handleCloseModal = () => {
    const modalOverlay = document.querySelector('.game-over-modal-overlay');
    if (modalOverlay) {
      modalOverlay.classList.add('hidden');
    }
  };

  const getStatusText = () => {
    if (gameMode === 'ai_vs_ai') {
      return `AI vs. AI: ${gameState.turn.charAt(0).toUpperCase() + gameState.turn.slice(1)}'s turn`;
    }
    return `${gameState.turn.charAt(0).toUpperCase() + gameState.turn.slice(1)}'s turn`;
  };

  return (
    <div className="game-status-container">
      <p className="turn-indicator">
        {getStatusText()}
        {(isAIThinking || gameState.ai_thinking) && (
          <span className="ai-thinking-indicator">AI thinking...</span>
        )}
      </p>
      {gameState.message && !gameState.game_over && (
        <p className="game-message">{gameState.message}</p>
      )}

      {gameState.game_over && (
        <div className="game-over-modal-overlay">
          <div className="game-over-modal">
            <button className="modal-close-button" onClick={handleCloseModal} aria-label="Close modal">
              ×
            </button>
            <div className="modal-header">
              <div className={`modal-icon ${isCheckmate ? 'checkmate' : isStalemate ? 'stalemate' : 'game-over'}`}>
                {isCheckmate ? '♔' : isStalemate ? '=' : '🏁'}
              </div>
              <h3 className="modal-title">
                {isCheckmate ? 'Checkmate!' : isStalemate ? 'Stalemate!' : 'Game Over!'}
              </h3>
            </div>
            <p className="modal-message">{gameState.message}</p>
            <div className="modal-buttons">
              <button className="modal-button retry-button" onClick={handleRetry}>
                Play Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}