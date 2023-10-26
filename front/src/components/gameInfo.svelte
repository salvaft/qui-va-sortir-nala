<script>
	import { page } from '$app/stores';
	import { gameStore } from '$lib/store';
	import { CodeBlock } from '@skeletonlabs/skeleton';
</script>

<div class="mx-auto">
	<span>Status:</span>

	<span class="badge variant-ghost-tertiary mx-auto">
		{#if $gameStore.status === 'waiting'}
			Te toca esperar al otro mona
		{:else if $gameStore.status === 'playing'}
			Te toca jugar
		{:else if $gameStore.status === 'finished' && $gameStore.winner === $gameStore.me}
			Ganaste
		{:else if $gameStore.status === 'finished' && $gameStore.winner === $gameStore.they}
			Palmaste
		{:else}
			Empate
		{/if}
	</span>
</div>
{#if $page.data.isSalva}
	<CodeBlock
		class="mx-auto min-w-[350px]"
		language="json"
		code={`${JSON.stringify(
			{
				Nos: $gameStore.me.split('-')[0],
				Vos: $gameStore.they.split('-')[0],
				status: $gameStore.status
			},
			null,
			2
		)}`}
	/>
{/if}
