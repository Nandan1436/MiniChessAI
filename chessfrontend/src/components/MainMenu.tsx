'use client';

import { useState } from 'react';

interface MainMenuProps {
  onSelectMode: (mode: 'ai' | 'human', depth?: number) => void;
}

export default function MainMenu({ onSelectMode }: MainMenuProps) {
  const [showDifficulty, setShowDifficulty] = useState(false);

  const handlePlayVsAI = () => {
    setShowDifficulty(true);
  };

  const handleDifficultySelect = (depth: number) => {
    onSelectMode('ai', depth);
  };

  return (
    <div className="menu-container">
      <h1 className="text-4xl font-bold text-indigo-900 mb-8">MiniChess (6x5)</h1>
      {!showDifficulty ? (
        <div className="flex flex-col gap-4">
          <button className="menu-button" onClick={handlePlayVsAI}>
            Play vs AI
          </button>
          <button className="menu-button" onClick={() => onSelectMode('human')}>
            Play vs Human
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Select Difficulty</h2>
          <button className="menu-button" onClick={() => handleDifficultySelect(1)}>
            Easy (Depth 1)
          </button>
          <button className="menu-button" onClick={() => handleDifficultySelect(2)}>
            Medium (Depth 2)
          </button>
          <button className="menu-button" onClick={() => handleDifficultySelect(3)}>
            Hard (Depth 3)
          </button>
          <button
            className="menu-button"
            onClick={() => setShowDifficulty(false)}
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
}