import { ActionFunction, redirect } from 'react-router-dom';
import {
	clearTokenFromStorage,
	getNewToken,
	loadTokenFromStorage,
} from '../../helperModules/helpers';

const submitForm = async (id: string, token: string) => {
	const apiUrl = `${import.meta.env.VITE_API_URI}/posts/${id}`;
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
		const token = loadTokenFromStorage();
		if (!token) return redirect('/login');
		const response = await submitForm(postId, token.accessToken);
		if (!response.ok) {
			if (response.status === 401 || response.status === 403) {
				// token is not valid, request new token
				const newToken = await getNewToken(token.refreshToken);
				if (typeof newToken === 'undefined') {
					// Something went wrong when requesting new token,
					// logout user and redirect user to login page.
					clearTokenFromStorage();
					return redirect('/login');
				}
				const response = await submitForm(postId, newToken);
				if (!response.ok) throw new Error(response.statusText);
				else return redirect('/');
			}
			throw new Error(response.statusText);
		} else {
			return redirect('/');
		}
	} catch (error) {
		console.log(error);
		return error;
	}
};

export default action;
