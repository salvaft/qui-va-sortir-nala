<script lang="ts">
	import { getPatita } from '$lib/consts';
	import { gameStore } from '$lib/store';
	import Square from './square.svelte';
</script>

<section>
	<Square bg={`url(${getPatita($gameStore.m1)})`} />
	{#if $gameStore.m2 !== ''}
		<Square bg={`url(${getPatita($gameStore.m2)})`} />
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
