import { ActionFunction, redirect } from 'react-router-dom';
import { loadTokenFromStorage, getNewToken, clearTokenFromStorage } from '../../helperModules/helpers';

const submitForm = async (formData: string, postId: string, token: string) => {
	const apiUrl = `${import.meta.env.VITE_API_URI}/posts/${postId}/publish`;
	const fetchOpts: RequestInit = {
		method: 'put',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json',
			authorization: `Bearer ${token}`,
		},
		body: formData,
	};
	return fetch(apiUrl, fetchOpts);
};

const action: ActionFunction = async ({ request, params }) => {
	try {
		const formData = Object.fromEntries(await request.formData());
		const postId = params.postId;
		if (!postId) return redirect('/');
		const token = loadTokenFromStorage();
		if (token === null) return redirect('/login');
		const response = await submitForm(
			JSON.stringify(formData),
			postId,
			token.accessToken,
		);
		if (!response.ok) {
			if (response.status === 403) {
				// Access token is invalid request for new token
				const newToken = (await getNewToken(token.refreshToken));
				if (typeof newToken === "undefined") {
					// something went wrong while fetching newToken 
					// logout user and redirect to login page.
					clearTokenFromStorage();
					return redirect('/login');
				}
				const newResponse = await submitForm(
					JSON.stringify(formData),
					postId,
					newToken,
				);
				if (!newResponse.ok) throw new Error(response.statusText);
			}
			if (response.status === 404) return redirect('/');
			throw new Error(response.statusText);
		}
		if (response.status === 200) return null;
	} catch (error) {
		console.log(error);
		return error;
	}
};

export default action ;
