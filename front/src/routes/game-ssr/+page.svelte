<script lang="ts">
	import { onMount } from 'svelte';
	import { io } from 'socket.io-client';
	import type { wsClient, RecordSSR } from '$lib/types';
	import { page } from '$app/stores';
	import { confettiAndResetGameStore, enableButtons } from '$lib/utils';
	import { gameStore, socketStore } from '$lib/store';
	import { PUBLIC_WS_URI } from '$env/static/public';
	import Board from '@components/board.svelte';
	import Movements from '@components/movements.svelte';
	import Waiter from '@components/waiter.svelte';
	import GameInfo from '@components/gameInfo.svelte';
	import { createHandleClickSSR } from '$lib/utils-ssr';

	let socket: wsClient;

	$: if ($gameStore.finished === true) {
		setTimeout(() => {
			confettiAndResetGameStore();
		}, 400);
	}

	onMount(() => {
		$gameStore.me = $page.data.id;
		$gameStore.myUsername = $page.data.username;

		if (!socket)
			socket = io(PUBLIC_WS_URI, { query: { id: $page.data.id, username: $page.data.username } });
		socket.on('hello', ({ waiting }) => {
			$socketStore = socket.id;
			$gameStore.waiting = waiting;
			if (!waiting) {
				enableButtons();
			}
		});
		socket.on('meet', ({ id, username }) => {
			$gameStore.they = id;
			$gameStore.theirUsername = username;
			socket.emit('meetBack', { id: $page.data.id });
		});
		socket.on('meetBack', ({ id, username }) => {
			$gameStore.they = id;
			$gameStore.theirUsername = username;
		});
		socket.on('leave', () => {
			$gameStore.they = '';
			$gameStore.theirUsername = '';
		});

		socket.on('move', (record: RecordSSR) => {
			if (!$gameStore.partida) {
				$gameStore.partida = record.id;
				$gameStore.m2 = record.m1;
			}
			$gameStore.finished = record.finished;
			$gameStore.winner = record.winner;
			$gameStore.waiting = !$gameStore.waiting;
		});

		return () => {
			socket.disconnect();
			gameStore.reset();
			socketStore.set('');
		};
	});
</script>

<Board />
<Movements clickHandler={createHandleClickSSR({ socket, gameStore })} />
<Waiter />
<GameInfo />
