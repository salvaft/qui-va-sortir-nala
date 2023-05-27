//Todo namespaces

// Game

export type GameStatus = {
	m1: Move | '';
	m2: Move | '';
	partida: string;
	move: Move | '';
	finished: boolean;
	me: string;
	they: string;
	winner: string | null;
	waiting: boolean;
	started: boolean;
	myUsername: string;
	theirUsername: string;
};

export type Move = (typeof moves)[number];

// PB schemas
export type RecordSSR = {
	collectionId: string;
	collectionName: string;
	created: string;
	id: string;
	m1: Move;
	m2: Move;
	p1: string;
	p2: string;
	updated: string;
	finished: boolean;
	winner: string | null;
};
export type RoomRecord = {
	collectionId: string;
	collectionName: string;
	created: string;
	id: string;
	m1: Move;
	m2: Move;
	p1: string;
	p2: string;
	free: boolean;
	finished: boolean;
	winner: string | null;
	turn: string;
	next: string;
	comment: string;
	expand?: {
		p1: { username: string };
		p2: { username: string };
	};
};

// Websockets
import { Socket } from 'socket.io-client';

export interface ServerToClientEvents {
	noArg: () => void;
	basicEmit: (a: number, b: string, c: Buffer) => void;
	withAck: (d: string, callback: (e: number) => void) => void;
	hello: (f: { waiting: boolean }) => void;
	meet: (f: { id: string; username: string }) => void;
	meetBack: (f: { id: string; username: string }) => void;

	leave: (f: { id: string; username: string }) => void;
	move: (m: RecordSSR) => void;
}

export interface ClientToServerEvents {
	move: (m: GameStatus) => void;
	meet: (f: { id: string }) => void;
	meetBack: (f: { id: string }) => void;

	leave: (f: { id: string }) => void;
}

export interface InterServerEvents {
	ping: () => void;
}

export interface SocketData {
	name: string;
	age: number;
}

import { Server } from 'socket.io';
export type wsServer = Server<
	ClientToServerEvents,
	ServerToClientEvents,
	InterServerEvents,
	SocketData
>;

export type wsClient = Socket<ServerToClientEvents, ClientToServerEvents>;

import type { http } from '@types/node';
import type { moves } from './consts';

export type ConfigureServer = (server: { httpServer: http }) => void;

import { Flow } from './consts';
type FlowKeys = keyof typeof Flow;
export type IFlow = (typeof Flow)[FlowKeys];
