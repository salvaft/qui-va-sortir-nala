<script lang="ts">
	import { patitas } from '$lib/consts';
	import { gameStore } from '$lib/store';
	import Square from './square.svelte';
	$: m1 = $gameStore.m1;
	$: m2 = $gameStore.m2;
</script>

<section>
	<Square bg={`url(${patitas[m1]})`} />
	{#if $gameStore.finished}
		<Square bg={`url(${patitas[m2]})`} />
	{:else}
		<Square />
	{/if}
</section>

<style>
	section {
		display: flex;
		justify-content: center;
		gap: 10px;
	}
</style>
