import { ActionFunction, redirect } from 'react-router-dom';
import { getNewToken, loadTokenFromStorage } from '../../helperModules/helpers';

const submitForm = async (postId: string, commentId: string, token: string) => {
	const apiUrl = `${
		import.meta.env.VITE_API_URI
	}/posts/${postId}/comments/${commentId}`;
	const fetchOpts: RequestInit = {
		method: 'DELETE',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	};
	return fetch(apiUrl, fetchOpts);
};

const action: ActionFunction = async ({ params }) => {
	try {
		const postId = params.postId!;
		const commentId = params.commentId!;
		const token = loadTokenFromStorage();
		if (!token) return redirect('/login');
		const response = await submitForm(postId, commentId, token.accessToken);
		if (!response.ok) {
			if (response.status === 401 || response.status === 403) {
				const newToken = (await getNewToken(token.refreshToken)) as string;
				const response = await submitForm(postId, commentId, newToken);
				if (!response.ok) throw new Error(response.statusText);
				else return redirect(`/post/${postId}`);
			}
			throw new Error(response.statusText);
		} else {
			return redirect(`/post/${postId}`);
		}
	} catch (error) {
		console.log(error);
		return error;
	}
};

export { action };
