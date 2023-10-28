import { ActionFunction, redirect } from 'react-router-dom';
import {
	clearTokenFromStorage,
	getNewToken,
	loadTokenFromStorage,
} from '../../helperModules/helpers';
import type { TPost } from '../../types';

const submitForm = async (formData: string, token: string) => {
	const apiUrl = `${import.meta.env.VITE_API_URI}/posts`;
	const fetchOpts: RequestInit = {
		method: 'post',
		mode: 'cors',
		headers: {
			'Content-Type': 'application/json',
			authorization: `Bearer ${token}`,
		},
		body: formData,
	};
	return fetch(apiUrl, fetchOpts);
};

const action: ActionFunction = async ({ request }) => {
	try {
		const formData = Object.fromEntries(await request.formData());
		const token = loadTokenFromStorage();
		if (token === null) return redirect('/login');
		const response = await submitForm(
			JSON.stringify(formData),
			token.accessToken,
		);
		if (!response.ok) {
			if (response.status === 403) {
				// Token is not valid, request for new token
				const newToken = await getNewToken(token.refreshToken);
				if (typeof newToken === 'undefined') {
					// something went wrong when requesting new token, logoff user
					// and redirect to login page.
					clearTokenFromStorage();
					return redirect('/login');
				}
				const newResponse = await submitForm(
					JSON.stringify(formData),
					newToken,
				);
				if (!newResponse.ok) throw new Error(response.statusText);
				else {
					const data = (await newResponse.json()) as TPost;
					return redirect(`/post/${data.id}`);
				}
			}
			if (response.status === 406) {
				return response;
			}
			throw new Error(response.statusText);
		}
		const data = (await response.json()) as TPost;
		return redirect(`/post/${data.id}`);
	} catch (error) {
		console.error(error);
		return error;
	}
};

export default action;
