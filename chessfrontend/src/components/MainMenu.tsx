'use client';

import { useState } from 'react';

interface MainMenuProps {
  onSelectMode: (mode: 'ai' | 'human' | 'ai_vs_ai', depthWhite?: number, depthBlack?: number) => void;
}

export default function MainMenu({ onSelectMode }: MainMenuProps) {
  const [showDifficulty, setShowDifficulty] = useState<'none' | 'ai' | 'ai_vs_ai_white' | 'ai_vs_ai_black'>('none');
  const [whiteDepth, setWhiteDepth] = useState<number | null>(null);

  const handlePlayVsAI = () => {
    setShowDifficulty('ai');
  };

  const handleAIVsAI = () => {
    setShowDifficulty('ai_vs_ai_white');
  };

  const handleDifficultySelect = (depth: number) => {
    if (showDifficulty === 'ai') {
      onSelectMode('ai', depth, depth);
    } else if (showDifficulty === 'ai_vs_ai_white') {
      setWhiteDepth(depth);
      setShowDifficulty('ai_vs_ai_black');
    } else if (showDifficulty === 'ai_vs_ai_black') {
      onSelectMode('ai_vs_ai', whiteDepth ?? 2, depth);
      setWhiteDepth(null);
    }
  };

  return (
    <div className="menu-container">
      <h1 className="text-4xl font-bold text-indigo-900 mb-8">MiniChess (6x5)</h1>
      {showDifficulty === 'none' ? (
        <div className="flex flex-col gap-4">
          <button className="menu-button" onClick={handlePlayVsAI}>
            Play vs AI
          </button>
          <button className="menu-button" onClick={() => onSelectMode('human')}>
            Play vs Human
          </button>
          <button className="menu-button" onClick={handleAIVsAI}>
            AI vs AI
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            {showDifficulty === 'ai' ? 'Select AI Difficulty' : 
             showDifficulty === 'ai_vs_ai_white' ? 'Select White AI Difficulty' : 
             'Select Black AI Difficulty'}
          </h2>
          <button className="menu-button" onClick={() => handleDifficultySelect(1)}>
            Easy
          </button>
          <button className="menu-button" onClick={() => handleDifficultySelect(2)}>
            Medium 
          </button>
          <button className="menu-button" onClick={() => handleDifficultySelect(3)}>
            Hard
          </button>
          <button className="menu-button" onClick={() => {
            setShowDifficulty('none');
            setWhiteDepth(null);
          }}>
            Back
          </button>
        </div>
      )}
    </div>
  );
}