'use client';

import { useEffect, useState, useCallback } from 'react';
import ChessBoard from '../components/ChessBoard';
import GameStatus from '../components/GameStatus';
import { GameState } from '../components/types';
import { initGame, selectPiece, makeMove, makeAIMove, getGameState } from '../lib/api';

export default function Home() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAIThinking, setIsAIThinking] = useState(false);

  const fetchGameState = async () => {
    try {
      setIsLoading(true);
      const state = await getGameState();
      setGameState(state);
    } catch (error) {
      console.error('Failed to fetch game state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInitGame = async () => {
    try {
      setIsLoading(true);
      const state = await initGame();
      setGameState(state);
    } catch (error) {
      console.error('Failed to initialize game:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPiece = async (row: number, col: number) => {
    if (isLoading || isAIThinking || gameState?.ai_thinking || gameState?.game_over) return;
    try {
      setIsLoading(true);
      const state = await selectPiece(row, col);
      setGameState(state);
    } catch (error) {
      console.error('Failed to select piece:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMove = useCallback(async (start_row: number, start_col: number, end_row: number, end_col: number) => {
    if (isLoading || isAIThinking || gameState?.ai_thinking || gameState?.game_over) return;
    try {
      setIsLoading(true);
      const state = await makeMove({ start_row, start_col, end_row, end_col });
      setGameState(state);
      if (state.turn === 'black' && !state.game_over && !state.ai_thinking) {
        setIsAIThinking(true);
        console.log('AI thinking started');
        const startTime = Date.now();
        const aiStatePromise = makeAIMove();
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const aiState = await aiStatePromise;
        const elapsed = Date.now() - startTime;
        if (elapsed < 1000) {
          await new Promise((resolve) => setTimeout(resolve, 1000 - elapsed));
        }
        setGameState(aiState);
        setIsAIThinking(false);
        console.log('AI thinking ended');
      }
    } catch (error) {
      console.error('Failed to make move:', error);
    } finally {
      setIsLoading(false);
    }
  }, [gameState, isLoading, isAIThinking]);

  useEffect(() => {
    handleInitGame();
  }, []);

  if (isLoading && !gameState) {
    return <p className="text-center text-lg">Loading...</p>;
  }

  return (
    <div className="text-center bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-4">MiniChess (6x5)</h1>
      {gameState ? (
        <>
          <ChessBoard
            gameState={gameState}
            onSelectPiece={handleSelectPiece}
            onMove={handleMove}
            isAIThinking={isAIThinking}
          />
          <GameStatus gameState={gameState} onRestart={handleInitGame} isAIThinking={isAIThinking} />
        </>
      ) : (
        <p className="text-center text-lg">Failed to load game</p>
      )}
    </div>
  );
}
