import { LoaderFunction, defer, redirect } from 'react-router-dom';
import { loadTokenFromStorage } from '../../helperModules/helpers';

const loader: LoaderFunction = ({ request }) => {
	const cursor = new URL(request.url).searchParams.get('f');
	const direction = new URL(request.url).searchParams.get('d');
	const token = loadTokenFromStorage();
	if (token === null) return redirect('/login');
	let fetchUrl;
	if (cursor) {
		fetchUrl = direction
			? `${import.meta.env.VITE_API_URI}/posts?f=${cursor}&d=${direction}`
			: `${import.meta.env.VITE_API_URI}/posts?f=${cursor}`;
	} else {
		fetchUrl = `${import.meta.env.VITE_API_URI}/posts`;
	}
	const fetchOpts: RequestInit = {
		mode: 'cors',
		headers: { authorization: `Bearer ${token}` },
	};
	return defer({
		posts: fetch(fetchUrl, fetchOpts).then((res) => {
			if (!res.ok) throw new Error(res.statusText);
			return res.json();
		}),
	});
};

export { loader };
