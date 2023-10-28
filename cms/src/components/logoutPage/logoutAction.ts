import { ActionFunction, redirect } from 'react-router-dom';
import { clearTokenFromStorage, loadTokenFromStorage } from '../../helperModules/helpers';

const submitForm = async (token: string) => {
	const apiUrl = `${import.meta.env.VITE_API_URI}/logout`;
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

const action: ActionFunction = async () => {
	try {
		const token = loadTokenFromStorage();
		if (!token) return redirect('/login');
		await submitForm(token.refreshToken);
		// the only errors thrown is when the refresh token
		// is not valid, which is the same as logout(although
		// the token is not removed from database) hence complete
		// the client side logout
		clearTokenFromStorage();
		return redirect('/login');
	} catch (error) {
		console.log(error);
		return error;
	}
};

export default action;
