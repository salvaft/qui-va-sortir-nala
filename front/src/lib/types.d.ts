import type { moves } from './consts';

// Game Status
export type GameStatus = {
	m1: Move;
	m2: Move;
	me: string;
	they: string;
	winner: string | null;
	status: 'playing' | 'finished' | 'waiting';
};

export type Move = (typeof moves)[number] | '';

export type EventType = 'join' | 'leave' | 'meet' | 'opponentMove';
