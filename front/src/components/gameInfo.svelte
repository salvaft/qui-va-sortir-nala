<script>
	import { gameStore } from '$lib/store';
	import { CodeBlock } from '@skeletonlabs/skeleton';
</script>

<div class="mx-auto">
	<span>Partida:</span>

	<span class="badge variant-ghost-tertiary mx-auto">
		{#if $gameStore.partida}{$gameStore.partida}
		{:else}
			No empezada
		{/if}
	</span>
</div>
<CodeBlock
	class="mx-auto min-w-[350px]"
	language="json"
	code={`${JSON.stringify({ Nos: $gameStore.myUsername, Vos: $gameStore.theirUsername }, null, 2)}`}
/>
