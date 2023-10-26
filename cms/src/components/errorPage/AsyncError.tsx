import { useAsyncError } from 'react-router-dom';

const AsyncError = () => {
	const errors = useAsyncError() as Error;
	return <p>{errors.message}</p>;
};

export default AsyncError;
