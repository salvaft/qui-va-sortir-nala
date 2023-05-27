<script>
	import Navigation from '@components/navigation.svelte';
	import Header from '@components/header.svelte';
	// Your selected Skeleton theme:
	import '@skeletonlabs/skeleton/themes/theme-skeleton.css';
	// This contains the bulk of Skeletons required styles:
	import '@skeletonlabs/skeleton/styles/all.css';
	// Finally, your application's global stylesheet (sometimes labeled 'app.css')
	import '../app.postcss';
	import { Toast } from '@skeletonlabs/skeleton';
</script>

<Toast />
<Navigation />
<Header />
<main>
	<slot />
</main>

<style>
	main {
		display: grid;
		place-content: center;
		gap: 1rem;
		padding: 1rem;

		grid-template-columns: 1;
		@media screen and (min-width: 768px) {
			padding: 0rem;
		}
	}
</style>
