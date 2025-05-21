'use client';

import { useEffect, useState, useCallback } from 'react';
import ChessBoard from '../components/ChessBoard';
import GameStatus from '../components/GameStatus';
import MainMenu from '../components/MainMenu';
import { GameState, initGame, makeAIMove, selectPiece, makeMove} from '../lib/api';

export default function Home() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [gameMode, setGameMode] = useState<'menu' | 'ai' | 'human' | 'ai_vs_ai'>('menu');
  const [aiDepthWhite, setAIDepthWhite] = useState<number>(2);
  const [aiDepthBlack, setAIDepthBlack] = useState<number>(2);
  const [error, setError] = useState<string | null>(null);

  

  const handleInitGame = async (mode: 'ai' | 'human' | 'ai_vs_ai', depthWhite?: number, depthBlack?: number) => {
    try {
      setIsLoading(true);
      setError(null);
      const state = await initGame({ mode, ai_depth_white: depthWhite, ai_depth_black: depthBlack });
      setGameState(state);
      setGameMode(mode);
      setAIDepthWhite(depthWhite || 2);
      setAIDepthBlack(depthBlack || 2);
    } catch (error) {
      console.error('Failed to initialize game:', error);
      setError('Failed to initialize game. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPiece = async (row: number, col: number) => {
    if (gameMode === 'ai_vs_ai' || isLoading || isAIThinking || gameState?.ai_thinking || gameState?.game_over) return;
    try {
      setIsLoading(true);
      setError(null);
      const state = await selectPiece(row, col);
      setGameState(state);
    } catch (error) {
      console.error('Failed to select piece:', error);
      setError('Failed to select piece. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMove = useCallback(async (start_row: number, start_col: number, end_row: number, end_col: number) => {
    if (gameMode === 'ai_vs_ai' || isLoading || isAIThinking || gameState?.ai_thinking || gameState?.game_over) return;
    try {
      setIsLoading(true);
      setError(null);
      const state = await makeMove({ start_row, start_col, end_row, end_col });
      setGameState(state);
      if (gameMode === 'ai' && state.turn === 'black' && !state.game_over && !state.ai_thinking) {
        await triggerAIMove();
      }
    } catch (error) {
      console.error('Failed to make move:', error);
      setError('Failed to make move. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [gameState, isLoading, isAIThinking, gameMode]);

  const triggerAIMove = useCallback(async () => {
    if (!gameState || gameState.game_over || gameState.ai_thinking || isAIThinking) return;
    try {
      setIsAIThinking(true);
      console.log('AI thinking started');
      const startTime = Date.now();
      const aiState = await makeAIMove();
      const elapsed = Date.now() - startTime;
      if (elapsed < 1000) {
        await new Promise((resolve) => setTimeout(resolve, 1000 - elapsed));
      }
      setGameState(aiState);
      console.log('AI thinking ended');
    } catch (error) {
      console.error('Failed to make AI move:', error);
      setError('Failed to make AI move. Please try again.');
    } finally {
      setIsAIThinking(false);
    }
  }, [gameState, isAIThinking]);

  useEffect(() => {
    if (gameMode === 'ai_vs_ai' && gameState && !gameState.game_over && !gameState.ai_thinking && !isAIThinking) {
      triggerAIMove();
    }
  }, [gameState, gameMode, isAIThinking, triggerAIMove]);

  useEffect(() => {
    if (gameMode !== 'menu') {
      handleInitGame(gameMode, aiDepthWhite, aiDepthBlack);
    }
  }, [gameMode, aiDepthWhite, aiDepthBlack]);

  if (isLoading && !gameState) {
    return (
      <div className="flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-t-violet-600 border-gray-200 rounded-full loading"></div>
        <p className="mt-4 text-lg text-gray-700">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      {gameMode === 'menu' ? (
        <MainMenu
          onSelectMode={(mode, depthWhite, depthBlack) => {
            setGameMode(mode);
            if (depthWhite) setAIDepthWhite(depthWhite);
            if (depthBlack) setAIDepthBlack(depthBlack);
          }}
        />
      ) : (
        <div className="game-container">
          <h1 className="text-4xl font-bold text-indigo-900 mb-6">MiniChess (6x5)</h1>
          {error && (
            <p className="text-center text-lg text-red-600 mb-4">{error}</p>
          )}
          {gameState ? (
            <>
              <ChessBoard
                gameState={gameState}
                onSelectPiece={handleSelectPiece}
                onMove={handleMove}
                isAIThinking={isAIThinking || gameState.ai_thinking}
              />
              <GameStatus gameState={gameState} onRestart={() => setGameMode('menu')} isAIThinking={isAIThinking} gameMode={gameMode} />
            </>
          ) : (
            <div className="text-center">
              <p className="text-lg text-red-600 mb-4">Failed to load game</p>
              <button
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                onClick={() => handleInitGame(gameMode, aiDepthWhite, aiDepthBlack)}
              >
                Retry
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}