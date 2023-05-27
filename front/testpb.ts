import PocketBase from 'pocketbase';
import dotenv from 'dotenv';
dotenv.config();
const pb = new PocketBase(process.env.PUBLIC_POCKETBASE_URI);

const list = await pb.collection('users').listAuthMethods();

pb.collection('users')
	.listAuthMethods()
	.then(({ authProviders }) => {
		console.log(authProviders);
	})
	.catch((e) => {
		console.log(e);
	});

console.log(list.authProviders);
