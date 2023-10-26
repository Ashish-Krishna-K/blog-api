import { Outlet, Navigate } from 'react-router-dom';
import { loadTokenFromStorage } from '../../helperModules/helpers';
import { Link } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import styles from './App.module.css';

const App = () => {
	const auth = !!loadTokenFromStorage();

	if (!auth) return <Navigate to={'/login'} />;

	return (
		<>
			<header className={styles.header}>
				<Link to={'/'}>
					<h1>Blog CMS</h1>
				</Link>
				<Navbar />
			</header>
			<main className={styles.main}>
				<Outlet />
			</main>
		</>
	);
};

export default App;
