import { LoaderFunction, defer } from 'react-router-dom';

const loader: LoaderFunction = ({ request }) => {
	const cursor = new URL(request.url).searchParams.get('f');
	const direction = new URL(request.url).searchParams.get('d');
	let fetchUrl;
	if (cursor) {
		fetchUrl = direction
			? `${import.meta.env.VITE_API_URI}/posts?f=${cursor}&d=${direction}`
			: `${import.meta.env.VITE_API_URI}/posts?f=${cursor}`;
	} else {
		fetchUrl = `${import.meta.env.VITE_API_URI}/posts`;
	}
	return defer({
		posts: fetch(fetchUrl, { mode: 'cors' }).then((res) => {
			if (!res.ok) throw new Error(res.statusText);
			return res.json();
		}),
	});
};

export { loader };
