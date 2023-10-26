import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = () => {
	return (
		<nav>
			<ul className={styles.navbar}>
				<li>
					<Link to={'/post/create'}>Add New Post</Link>
				</li>
				<li>
					<Link to={'/logout'}>Logout</Link>
				</li>
			</ul>
		</nav>
	);
};

export default Navbar;
