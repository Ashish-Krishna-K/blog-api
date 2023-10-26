import { redirect, type ActionFunction } from 'react-router-dom';
import { saveTokenToStorage } from '../../helperModules/helpers';

export const action: ActionFunction = async ({ request }) => {
	try {
		const formData = Object.fromEntries(await request.formData());
		const base = import.meta.env.VITE_API_URI as string;
		const response = await fetch(`${base}/login`, {
			method: 'POST',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(formData),
		});
		const data = (await response.json()) as unknown;
		if (!response.ok) {
			if (response.status === 406) return data;
			if (response.status === 401) {
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
