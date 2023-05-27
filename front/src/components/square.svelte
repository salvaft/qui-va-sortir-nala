<script>
	export let bg = '';
</script>

<div class="square" style="--backgroundImage:{bg}" />

<style>
	.square {
		border: 1px solid #000;
		height: 100px;
		aspect-ratio: 1;
		cursor: pointer;
		background-image: var(--backgroundImage);
		background-position: center;
		background-size: contain;
		background-repeat: no-repeat;
	}
</style>
