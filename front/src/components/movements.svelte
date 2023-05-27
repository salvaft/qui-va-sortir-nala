<script lang="ts">
	import { browser } from '$app/environment';
	import { moves, patitas } from '$lib/consts';
	import { gameStore } from '$lib/store';
	import type { Move } from '$lib/types';
	import { disableButtons, enableButtons } from '$lib/utils';
	import Square from './square.svelte';
	export let clickHandler: null | ((m: Move) => void);
	$: if ((browser && $gameStore.waiting) || $gameStore.finished) {
		disableButtons();
	} else if (browser && !$gameStore.waiting && !$gameStore.finished) {
		enableButtons();
	}
</script>

<section id="board">
	{#if clickHandler}
		{#each moves as m (m)}
			<button
				disabled
				on:click={() => {
					if (clickHandler) clickHandler(m);
				}}
				><Square bg={`url(${patitas[m]})`} />
			</button>
		{/each}
	{/if}
</section>

<style>
	section {
		display: flex;
		justify-content: center;
		gap: 10px;
	}
</style>
