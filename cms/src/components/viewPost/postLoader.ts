import { LoaderFunction, defer, redirect } from 'react-router-dom';
import { loadTokenFromStorage } from '../../helperModules/helpers';

const loader: LoaderFunction = ({ params }) => {
	if (typeof params === 'undefined') return redirect('/');
	const token = loadTokenFromStorage();
	if (token === null) return redirect('/');
	const url = `${import.meta.env.VITE_API_URI}/posts/${params.postId}`;
	const opts: RequestInit = {
		mode: 'cors',
		headers: { authorization: `Bearer ${token}` },
	};
	return defer({
		post: fetch(url, opts).then((res) => {
			if (!res.ok) throw new Error(res.statusText);
			return res.json();
		}),
	});
};

export { loader };
