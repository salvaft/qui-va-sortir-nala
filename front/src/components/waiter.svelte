<script>
	import { gameStore } from '$lib/store';
</script>

{#if $gameStore.waiting && !$gameStore.finished}
	<h1>Te toca esperar al otro mona</h1>
{:else if !$gameStore.waiting && !$gameStore.finished}
	<h1>Te toca jugar</h1>
{:else if $gameStore.finished && $gameStore.winner === $gameStore.me}
	<h1>Ganaste</h1>
{:else if $gameStore.finished && $gameStore.winner === $gameStore.they}
	<h1>Palmaste</h1>
{:else}
	<h1>Empate</h1>
{/if}
