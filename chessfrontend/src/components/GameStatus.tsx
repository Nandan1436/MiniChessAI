import { GameState } from './types';

interface GameStatusProps {
  gameState: GameState;
  onRestart: () => void;
  isAIThinking: boolean;
}

export default function GameStatus({ gameState, onRestart, isAIThinking }: GameStatusProps) {
  return (
    <div className="mt-4">
      <p className="text-lg">
        {gameState.turn.charAt(0).toUpperCase() + gameState.turn.slice(1)}'s turn
        {(isAIThinking || gameState.ai_thinking) && (
          <span className="ml-2 text-blue-600 text-xl font-bold animate-pulse">AI thinking...</span>
        )}
      </p>
      {gameState.message && (
        <p className="text-xl font-bold mt-2">{gameState.message}</p>
      )}
      {gameState.game_over && (
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={onRestart}
        >
          Restart Game
        </button>
      )}
      {gameState.nodes_evaluated !== null && (
        <p className="text-sm mt-2">Nodes evaluated: {gameState.nodes_evaluated}</p>
      )}
    </div>
  );
}
