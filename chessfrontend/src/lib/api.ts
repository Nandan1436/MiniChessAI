
import { GameState, Move } from '../components/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function initGame(): Promise<GameState> {
  const response = await fetch(`${API_URL}/game/init`, { method: 'POST' });
  if (!response.ok) throw new Error('Failed to initialize game');
  return response.json();
}

export async function selectPiece(row: number, col: number): Promise<GameState> {
  const response = await fetch(`${API_URL}/game/select`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ row, col }),
  });
  if (!response.ok) throw new Error('Failed to select piece');
  return response.json();
}

export async function makeMove(move: Move): Promise<GameState> {
  const response = await fetch(`${API_URL}/game/move`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(move),
  });
  if (!response.ok) throw new Error('Failed to make move');
  return response.json();
}

export async function makeAIMove(): Promise<GameState> {
  const response = await fetch(`${API_URL}/game/ai_move`, { method: 'POST' });
  if (!response.ok) throw new Error('Failed to make AI move');
  return response.json();
}

export async function getGameState(): Promise<GameState> {
  const response = await fetch(`${API_URL}/game/state`);
  if (!response.ok) throw new Error('Failed to fetch game state');
  return response.json();
}
