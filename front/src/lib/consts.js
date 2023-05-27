export const moves = /** @type {const} */ (['✌️', '🖐️', '✊']);

export const patitas = /** @type {const} */ ({
	'✌️': '/tijera.PNG',
	'🖐️': '/papel.PNG',
	'✊': '/piedra.PNG',
	'': ''
});

export const combinations = /**@type {const} */ ([
	[['✌️', '🖐️'], '✌️'],
	[['🖐️', '✌️'], '✌️'],
	[['✌️', '✊'], '✊'],
	[['✊', '✌️'], '✊'],
	[['🖐️', '✊'], '🖐️'],
	[['✊', '🖐️'], '🖐️']
]);
/**
 * @type {import ('@skeletonlabs/skeleton').ModalSettings}
 */
export const alertLoser = {
	type: 'alert',
	// Data
	title: 'Packet!',
	body: 'Il faut se chauffer!',
	image: 'https://i.imgur.com/WOgTG96.gif'
};
/**
 * @type {import ('@skeletonlabs/skeleton').ModalSettings}
 */
export const alertWinner = {
	type: 'alert',
	// Data
	title: 'There is a winner',
	body: 'Bien joué',
	image: 'https://i.imgur.com/WOgTG96.gif'
};

export const Flow = /**@type {const} */ ({
	// ssr: Symbol('ssr'),
	ssr: 'ssr',
	pb: 'pb'
	// pb: Symbol('pb')
});
