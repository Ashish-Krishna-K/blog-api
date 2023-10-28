import { redirect, type ActionFunction } from 'react-router-dom';
import { saveTokenToStorage } from '../../helperModules/helpers';

const action: ActionFunction = async ({ request }) => {
	try {
		const formData = Object.fromEntries(await request.formData());
		const apiUrl = `${import.meta.env.VITE_API_URI}/login`;
		const response = await fetch(apiUrl, {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(formData),
		});
		const data = (await response.json()) as unknown;
		if (!response.ok) {
			// Validation error
			if (response.status === 406) return data;
			if (response.status === 401) {
				// credential error
				return {
					formData,
					errors: (data as Record<string, string>).message,
				};
			}
			throw new Error(response.statusText);
		} else {
			saveTokenToStorage(JSON.stringify(data));
			return redirect('/');
		}
	} catch (error) {
		console.log(error);
		return error;
	}
};

export default action;