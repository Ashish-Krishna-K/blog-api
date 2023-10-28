import { Form, useActionData, useNavigation } from 'react-router-dom';
import FullPageSkeleton from '../skeletons/FullPageSkeleton';
import styles from './Login.module.css';

type FormData = {
	email: string;
	password: string;
};

type ActionData = {
	formData: FormData;
	errors: Record<string, string>[] | string;
};

const Login = () => {
	const { state } = useNavigation();
	const actionData = useActionData() as ActionData;
	let emailErrors;
	let passwordErrors;
	if (
		typeof actionData !== 'undefined' &&
		'errors' in actionData &&
		typeof actionData.errors !== 'string'
		) {
		// API returned validation errors, since it's an array filter out the appropriate
		// errors based on field
		emailErrors = actionData.errors.filter((err) => err.path === 'email');
		passwordErrors = actionData.errors.filter((err) => err.path === 'password');
	}

	if (state !== 'idle') return <FullPageSkeleton />;
	return (
		<div className={styles.container}>
			<h1>Login</h1>
			<Form
				method="POST"
				id="login-form"
				className={styles.form}
			>
				{typeof actionData !== 'undefined' &&
					typeof actionData.errors === 'string' && (
						// API returned credentials errors
						<div className={styles.errorDiv}>
							<p className="error">{actionData.errors}</p>
						</div>
					)}
				<div>
					<label htmlFor="email">Email</label>
					{typeof emailErrors !== 'undefined' && (
						<ul>
							{emailErrors.map((err, ind) => (
								<li
									key={ind}
									className="error"
								>
									{err.msg}
								</li>
							))}
						</ul>
					)}
					<input
						type="email"
						name="email"
						id="email"
						required
					/>
				</div>
				<div>
					<label htmlFor="password">Password</label>
					{typeof passwordErrors !== 'undefined' && (
						<ul>
							{passwordErrors.map((err, ind) => (
								<li
									key={ind}
									className="error"
								>
									{err.msg}
								</li>
							))}
						</ul>
					)}
					<input
						type="password"
						name="password"
						id="password"
						required
					/>
				</div>
				<div className={styles.controls}>
					<button type="submit">Login</button>
					<button type="reset">Clear</button>
				</div>
			</Form>
		</div>
	);
};

export default Login;
