import { Link } from 'react-router-dom';
import styles from './HomeNavLinks.module.css';

type THomeNavLinksProps = {
	prevCursor: number | undefined;
	nextCursor: number | undefined;
};

const HomeNavLinks = ({ prevCursor, nextCursor }: THomeNavLinksProps) => {
	return (
		<nav className={styles.navLinks}>
			{prevCursor && (
				<Link
					to={`/?f=${prevCursor}&d=prev`}
					className={styles.prevLink}
				>
					Previous
				</Link>
			)}
			{nextCursor && (
				<Link
					to={`/?f=${nextCursor}`}
					className={styles.nextLink}
				>
					Next
				</Link>
			)}
		</nav>
	);
};

export default HomeNavLinks;
