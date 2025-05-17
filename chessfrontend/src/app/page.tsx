'use client';

import { useEffect, useState, useCallback } from 'react';
import ChessBoard from '../components/ChessBoard';
import GameStatus from '../components/GameStatus';
import MainMenu from '../components/MainMenu';
import { GameState } from '../lib/api';
import { initGame, selectPiece, makeMove, makeAIMove, getGameState } from '../lib/api';

export default function Home() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [gameMode, setGameMode] = useState<'menu' | 'ai' | 'human'>('menu');
  const [aiDepth, setAIDepth] = useState<number>(2);

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

  const handleInitGame = async (mode: 'ai' | 'human', depth?: number) => {
    try {
      setIsLoading(true);
      const state = await initGame({ mode, ai_depth: depth });
      setGameState(state);
      setGameMode(mode);
      setAIDepth(depth || 2);
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
      if (gameMode === 'ai' && state.turn === 'black' && !state.game_over && !state.ai_thinking) {
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
  }, [gameState, isLoading, isAIThinking, gameMode]);

  useEffect(() => {
    if (gameMode !== 'menu') {
      handleInitGame(gameMode, aiDepth);
    }
  }, [gameMode, aiDepth]);

  if (isLoading && !gameState) {
    return <p className="text-center text-lg text-white">Loading...</p>;
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      {gameMode === 'menu' ? (
        <MainMenu
          onSelectMode={(mode, depth) => {
            setGameMode(mode);
            if (depth) setAIDepth(depth);
          }}
        />
      ) : (
        <div className="game-container">
          <h1 className="text-4xl font-bold text-indigo-800 mb-4">MiniChess (6x5)</h1>
          {gameState ? (
            <>
              <ChessBoard
                gameState={gameState}
                onSelectPiece={handleSelectPiece}
                onMove={handleMove}
                isAIThinking={isAIThinking}
              />
              <GameStatus gameState={gameState} onRestart={() => setGameMode('menu')} isAIThinking={isAIThinking} />
            </>
          ) : (
            <p className="text-center text-lg text-red-600">Failed to load game</p>
          )}
        </div>
      )}
    </div>
  );
}
