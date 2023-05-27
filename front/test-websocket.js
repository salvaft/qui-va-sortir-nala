import io from 'socket.io-client';

import dotenv from 'dotenv';
dotenv.config();
// const PUBLIC_WS_URI = process.env.PUBLIC_WS_URI;
// const PUBLIC_WS_URI = 'http://192.168.0.113:5173';
const PUBLIC_WS_URI = 'https://nala.proxy.pve';

const socket = io(PUBLIC_WS_URI, { query: { id: 'asdfasdf', username: 'tpm' } });
socket.on('hello', ({ waiting }) => {
	console.log(socket.id);
	waiting;
});
