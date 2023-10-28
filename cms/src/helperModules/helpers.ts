import { redirect } from 'react-router-dom';
import type { TTokens } from '../types';

const saveTokenToStorage = (token: string) => {
	window.localStorage.setItem('tokens', token);
};

const loadTokenFromStorage = () => {
	const data = window.localStorage.getItem('tokens');
	return data ? (JSON.parse(data) as TTokens) : null;
};

const clearTokenFromStorage = () => {
	window.localStorage.removeItem('tokens');
	return;
};

const getFormattedDate = (date: Date) => {
	const userLang = navigator.language;
	return new Intl.DateTimeFormat(userLang, {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		weekday: 'long',
	}).format(date);
};

const getNewToken = async (
	refreshToken: string,
): Promise<string | undefined> => {
	try {
		const response = await fetch(`${import.meta.env.VITE_API_URI}/token`, {
			method: 'GET',
			mode: 'cors',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${refreshToken}`,
			},
		});
		const data = (await response.json()) as unknown;
		if (!response.ok) {
			if (response.status === 401 || response.status === 403) {
				// refresh token is not valid or user is not authorized, clear the invalid
				// tokens currently in storage and prompt user to login again.
				clearTokenFromStorage();
				redirect('/login');
				return undefined;
			}
			// unknown failure throw error
			else throw new Error(response.statusText);
		}
		const token: TTokens = {
			accessToken: data as string,
			refreshToken,
		};
		saveTokenToStorage(JSON.stringify(token));
		return data as string;
	} catch (error) {
		console.error(error);
	}
};

const closeModal = () => {
	const keyPress = new KeyboardEvent('keydown', {
		key: 'Escape',
		bubbles: true,
	});
	document.querySelector('dialog')?.dispatchEvent(keyPress);
};

export {
	saveTokenToStorage,
	loadTokenFromStorage,
	clearTokenFromStorage,
	getFormattedDate,
	getNewToken,
	closeModal,
};
