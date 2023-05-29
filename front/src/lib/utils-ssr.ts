import type {
	ClientToServerEvents,
	GameStatus,
	Move,
	ServerToClientEvents,
	wsClient
} from './types';
import type { Socket } from 'socket.io-client';
import type { Writable } from 'svelte/store';
import type { gameStore } from './store';
import { disableButtons, enableButtons, getGameStatusFromStore } from './utils';

export const move = async ({
	m,
	gameStore,
	socket
}: {
	socket: Socket<ServerToClientEvents, ClientToServerEvents>;
	gameStore: Writable<GameStatus>;
	m: Move;
}) => {
	disableButtons();

	gameStore.update((state) => {
		state.move = m;
		state.m1 = m;
		return state;
	});

	const gameStatus = getGameStatusFromStore();
	socket.emit('move', gameStatus);

	enableButtons();
};

export const createHandleClickSSR =
	({ socket, gameStore }: { socket: wsClient; gameStore: gameStore }) =>
	(m: Move) => {
		move({ gameStore, m, socket });
	};
