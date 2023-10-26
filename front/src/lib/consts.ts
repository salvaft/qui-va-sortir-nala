import type { Move } from './types';

export const moves = /** @type {const} */ ['✌️', '🖐️', '✊'] as const;

export const patitas = {
	'✌️': '/tijera.png',
	'🖐️': '/papel.png',
	'✊': '/piedra.png',
	'': '#'
} as const;

export function getPatita(m: Move) {
	return patitas[m];
}

export const combinations = /**@type {const} */ [
	[['✌️', '🖐️'], '✌️'],
	[['🖐️', '✌️'], '✌️'],
	[['✌️', '✊'], '✊'],
	[['✊', '✌️'], '✊'],
	[['🖐️', '✊'], '🖐️'],
	[['✊', '🖐️'], '🖐️']
];
