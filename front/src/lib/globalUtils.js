import { combinations } from './consts.js';

/**
 * @typedef {import('./types').Move} Move
 * @param {{ m1: Move; m2: Move; p1: string; p2: string }} param0
 */
export const checkWinner = ({ m1, m2, p1, p2 }) => {
	/**
	 * @type {import('./types').Move | null}
	 */
	let winnerMove = null;

	combinations.some(([[c1, c2], w]) => {
		if (c1 === m1 && c2 === m2) winnerMove = w;
	});
	const options = {
		[m1]: p1,
		[m2]: p2
	};
	if (winnerMove === null) return null;
	return options[winnerMove];
};
