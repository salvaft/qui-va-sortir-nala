import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { wsPlugin } from './websocket';

export default defineConfig({
	plugins: [sveltekit(), wsPlugin],
	resolve: {
		alias: {
			'@components': '/src/components',
			'#lib/*': './src/lib/*'
		}
	}
});
