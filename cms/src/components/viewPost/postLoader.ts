import { LoaderFunction, defer, redirect } from 'react-router-dom';

const loader: LoaderFunction = ({ params }) => {
	if (typeof params === 'undefined') return redirect('/');
	const url = `${import.meta.env.VITE_API_URI}/posts/${params.postId}`;
	return defer({
		post: fetch(url, { mode: 'cors' }).then((res) => {
			if (!res.ok) throw new Error(res.statusText);
			return res.json();
		}),
	});
};

export { loader };
