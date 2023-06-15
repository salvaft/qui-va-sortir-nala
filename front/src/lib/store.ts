import { writable } from 'svelte/store';
import { initGame } from '$lib/utils';
import { Flow } from './consts';
import PocketBase from 'pocketbase';
import { PUBLIC_POCKETBASE_URI } from '$env/static/public';
import type { IFlow } from './types.d';
import { browser } from '$app/environment';

const game = writable(initGame());

export const gameStore = {
	...game,
	reset: () =>
		game.update((state) => ({
			...initGame(),
			waiting: !state.waiting,
			myUsername: state.myUsername,
			theirUsername: state.theirUsername,
			me: state.me,
			they: state.they
		}))
};

export type gameStore = typeof gameStore;

export const socketStore = writable('');

function createFlowStore() {
	let initialFlow: IFlow = Flow.ssr;
	if (browser) {
		if (localStorage.getItem('flow') !== null) {
			initialFlow = localStorage.getItem('flow') as IFlow;
		}
	}
	const { set, update, subscribe } = writable(initialFlow);

	return {
		set(state: IFlow) {
			if (browser) {
				localStorage.setItem('flow', state);
			}
			set(state);
		},
		update,
		subscribe
	};
}
export const flowStore = createFlowStore();

export const pbStore = writable(new PocketBase(PUBLIC_POCKETBASE_URI));
