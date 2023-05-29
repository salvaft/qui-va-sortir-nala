<script lang="ts">
	import { patitas } from '$lib/consts';
	import { gameStore } from '$lib/store';
	import Square from './square.svelte';
	import { PUBLIC_SALVA_ID } from '$env/static/public';
	import { page } from '$app/stores';
	$: m1 = $gameStore.m1;
	$: m2 = $gameStore.m2;
	console.log($gameStore);
</script>

<section>
	<Square bg={`url(${patitas[m1]})`} />
	{#if $gameStore.finished || $page.data.id === PUBLIC_SALVA_ID}
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
