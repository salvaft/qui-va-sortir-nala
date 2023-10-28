import { writable } from 'svelte/store';
import type { GameStatus } from './types';

const game = writable(initGame());
export const errorStore = writable(false);

export const gameStore = {
	...game,
	reset: () => {
		game.update((state) => ({
			...initGame(),
			me: state.me
		}));
		errorStore.update(() => false);
	}
};

export type gameStore = typeof gameStore;
function initGame(): GameStatus {
	return {
		m1: '',
		m2: '',
		me: '',
		they: '',
		status: 'waiting',
		winner: ''
	};
}
