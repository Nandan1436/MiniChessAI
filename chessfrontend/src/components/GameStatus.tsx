import { GameState } from '../lib/api';

interface GameStatusProps {
  gameState: GameState;
  onRestart: () => void;
  isAIThinking: boolean;
}

export default function GameStatus({ gameState, onRestart, isAIThinking }: GameStatusProps) {
  return (
    <div className="mt-6 text-center">
      <p className="text-lg font-medium text-gray-800">
        {gameState.turn.charAt(0).toUpperCase() + gameState.turn.slice(1)}'s turn
        {(isAIThinking || gameState.ai_thinking) && (
          <span className="ml-3 text-violet-600 text-lg font-bold animate-pulse">AI thinking...</span>
        )}
      </p>
      {gameState.message && (
        <p className="text-xl font-bold text-red-600 mt-3">{gameState.message}</p>
      )}
      {gameState.game_over && (
        <button
          className="mt-4 px-6 py-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-all shadow-md hover:shadow-lg"
          onClick={onRestart}
        >
          Back to Menu
        </button>
      )}
    </div>
  );
}