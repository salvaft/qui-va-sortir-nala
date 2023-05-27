import PocketBase from 'pocketbase';
import dotenv from 'dotenv';

dotenv.config();

const pb = new PocketBase(process.env.POCKETBASE_URI);
try {
	await pb.admins.authWithPassword(process.env.PB_ADMIN, process.env.PB_PWD);
} catch (e) {
	console.log('Peto');
}

const records = await pb.collection('partidas').getFullList();

records.forEach((r) => {
	if (!r.finished) pb.collection('partidas').delete(r.id);
});
