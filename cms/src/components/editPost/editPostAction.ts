import { ActionFunction, redirect } from 'react-router-dom';
import { getNewToken, loadTokenFromStorage } from '../../helperModules/helpers';
import { TPost } from '../../types';

const submitForm = async (id: string, formData: string, token: string) => {
	const apiUrl = `${import.meta.env.VITE_API_URI}/posts/${id}`;
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
    const postId = params.postId!;
		const formData = Object.fromEntries(await request.formData());
		const token = loadTokenFromStorage();
		if (token === null) return redirect('/login');
		const response = await submitForm(
      postId,
			JSON.stringify(formData),
			token.accessToken,
		);
		if (!response.ok) {
			if (response.status === 403) {
				const newToken = (await getNewToken(token.refreshToken)) as string;
				const newResponse = await submitForm(
          postId,
					JSON.stringify(formData),
					newToken,
				);
				if (!newResponse.ok) throw new Error(response.statusText);
				else {
					const data = (await newResponse.json()) as TPost;
					return redirect(`/post/${data.id}`);
				};
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

export { action };