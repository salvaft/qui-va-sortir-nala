import injectSocketIO from './src/socketIOHandler';

export const wsPlugin = {
	name: 'plugin',
	/**
	 * @param {import ('vite').ViteDevServer } server
	 */
	configureServer(server) {
		// we can pass the server to Socket.io
		if (server.httpServer) injectSocketIO(server.httpServer);
		// ...
	}
};
