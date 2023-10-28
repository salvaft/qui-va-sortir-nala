<script lang="ts">
	import { browser } from '$app/environment';
	import { moves, patitas } from '$lib/consts';
	import { errorStore, gameStore } from '$lib/store';
	import type { Move } from '$lib/types';
	import Square from './square.svelte';

	$: if ((browser && $gameStore.status === 'waiting') || $gameStore.status === 'finished') {
		disableButtons();
	} else if (browser && $gameStore.status === 'playing') {
		enableButtons();
	}
	const disableButtons = () => {
		document.querySelectorAll('#board > button').forEach((b) => {
			if (b instanceof HTMLButtonElement && !b?.disabled) b.disabled = true;
		});
	};
	const enableButtons = () => {
		document.querySelectorAll('#board > button').forEach((b) => {
			if (b instanceof HTMLButtonElement && b?.disabled) b.disabled = false;
		});
	};
	const move = async ({ m }: { m: Move }) => {
		disableButtons();

		const res = await fetch('/api/sse', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ move: m })
		});
		if (res.ok) {
			gameStore.update((state) => {
				state.m1 = m;
				return state;
			});
			if ($gameStore.m1 !== '' && $gameStore.m2 !== '') {
				$gameStore.status = 'finished';
			} else {
				$gameStore.status = 'waiting';
			}
		} else {
			$errorStore = true;
		}
	};
</script>

<section id="board">
	{#each moves as m (m)}
		<button
			disabled
			on:click={() => {
				move({ m });
			}}
			><Square bg={`url(${patitas[m]})`} />
		</button>
	{/each}
</section>

<style>
	section {
		display: flex;
		justify-content: center;
		gap: 10px;
	}
</style>
