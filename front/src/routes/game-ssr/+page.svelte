<script lang="ts">
	import { onMount } from 'svelte';
	import { errorStore, gameStore } from '$lib/store';
	import Board from '@components/board.svelte';
	import Movements from '@components/movements.svelte';
	import GameInfo from '@components/gameInfo.svelte';
	import { combinations } from '$lib/consts';
	import type { EventType, Move } from '$lib/types';
	import confetti from 'canvas-confetti';

	let timeoutHandle: null | ReturnType<typeof setTimeout> = null;

	$: {
		if ($gameStore.status === 'finished') {
			$gameStore.winner = checkWinner({
				m1: $gameStore.m1,
				m2: $gameStore.m2,
				p1: $gameStore.me,
				p2: $gameStore.they
			});
			if ($gameStore.winner === $gameStore.me) {
				confetti();
			}
			timeoutHandle = setTimeout(() => {
				$gameStore.m1 = '';
				$gameStore.m2 = '';
				$gameStore.status = 'playing';
				timeoutHandle = null;
			}, 1000);
		}
	}

	const events = {
		meet: ({ they }: { they: string }) => {
			gameStore.reset();
			$gameStore.they = they;
			$gameStore.status = 'playing';
		},
		leave: () => {
			$gameStore.they = '';
			gameStore.reset();
		},
		opponentMove: ({ move }: { move: Move }) => {
			$gameStore.m2 = move;
			if ($gameStore.m1 !== '' && $gameStore.m2 !== '') {
				$gameStore.status = 'finished';
			}
		},
		join: ({ me }: { me: string }) => {
			$gameStore.me = me;
		}
	};
	onMount(() => {
		const evt = new EventSource('/api/sse');
		evt.onerror = (e) => {
			$errorStore = true;
			console.log("Max player limit reached, can't join");
		};
		evt.onmessage = (e) => {
			const data = JSON.parse(e.data);
			const eventName: EventType = data.eventType;
			const action = events[eventName];
			action(data);
		};

		return () => {
			evt.close();
			if (timeoutHandle !== null) clearTimeout(timeoutHandle);
			gameStore.reset();
		};
	});

	export const checkWinner = ({
		m1,
		m2,
		p1,
		p2
	}: {
		m1: Move;
		m2: Move;
		p1: string;
		p2: string;
	}) => {
		let winnerMove = null;

		combinations.some(([[c1, c2], w]) => {
			if (c1 === m1 && c2 === m2) winnerMove = w;
		});
		const options = {
			[m1]: p1,
			[m2]: p2
		};
		if (winnerMove === null) return null;
		return options[winnerMove];
	};
</script>

{#if $errorStore}
	<h1>Connection problem with server</h1>
{:else}
	<Board />
	<Movements />
	<GameInfo />
{/if}
