import type { AuthProviderInfo } from 'pocketbase';
import type { GameStatus } from './types';
import { gameStore } from './store';
import confetti from 'canvas-confetti';

export const createLinkHandler = (provider: AuthProviderInfo) => () => {
	localStorage.setItem('provider', JSON.stringify(provider));
};

export function initGame(): GameStatus {
	return {
		m1: '',
		m2: '',
		me: '',
		they: '',
		partida: '',
		move: '',
		finished: false,
		winner: '',
		waiting: false,
		started: false,
		myUsername: '',
		theirUsername: ''
	};
}

export const disableButtons = () => {
	document.querySelectorAll('#board > button').forEach((b) => {
		if (b instanceof HTMLButtonElement && !b?.disabled) b.disabled = true;
	});
};
export const enableButtons = () => {
	document.querySelectorAll('#board > button').forEach((b) => {
		if (b instanceof HTMLButtonElement && b?.disabled) b.disabled = false;
	});
};

export const confettiAndResetGameStore = (id?: string, cb?: (s: string) => void, next?: string) => {
	const game = getGameStatusFromStore();
	game.winner === game.me ? confetti() : null;

	setTimeout(() => {
		gameStore.reset();

		if (cb && next) cb(next);
	}, 2000);
};

export const getGameStatusFromStore = () => {
	let gameStatus: GameStatus = initGame();
	gameStore.subscribe((state) => {
		gameStatus = state;
	});
	return gameStatus;
};
