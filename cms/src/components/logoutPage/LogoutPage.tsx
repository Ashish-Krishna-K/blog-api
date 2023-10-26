import { Form, useNavigation } from 'react-router-dom';
import { closeModal } from '../../helperModules/helpers';
import OutletSkeleton from '../skeletons/OutletSkeleton';
import styles from './Logout.module.css';

const Logout = () => {
	const { state } = useNavigation();
	if (state !== 'idle') return <OutletSkeleton />;
	return (
		<>
			<h2>Do you really want to Logout?</h2>
			<Form
				method="delete"
				className={styles.form}
			>
				<button type="submit">Yes</button>
				<button
					type="button"
					onClick={closeModal}
				>
					No
				</button>
			</Form>
		</>
	);
};

export default Logout;
