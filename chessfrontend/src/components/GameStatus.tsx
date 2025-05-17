import { GameState } from '../lib/api';

interface GameStatusProps {
  gameState: GameState;
  onRestart: () => void;
  isAIThinking: boolean;
}

export default function GameStatus({ gameState, onRestart, isAIThinking }: GameStatusProps) {
  return (
    <div className="mt-4 text-center">
      <p className="text-lg text-gray-800">
        {gameState.turn.charAt(0).toUpperCase() + gameState.turn.slice(1)}'s turn
        {(isAIThinking || gameState.ai_thinking) && (
          <span className="ml-2 text-blue-600 text-xl font-bold animate-pulse">AI thinking...</span>
        )}
      </p>
      {gameState.message && (
        <p className="text-xl font-bold text-red-600 mt-2">{gameState.message}</p>
      )}
      {gameState.game_over && (
        <button
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
          onClick={onRestart}
        >
          Back to Menu
        </button>
      )}
      {gameState.nodes_evaluated !== null && (
        <p className="text-sm text-gray-600 mt-2">Nodes evaluated: {gameState.nodes_evaluated}</p>
      )}
    </div>
  );
}
