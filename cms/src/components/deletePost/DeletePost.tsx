import { Form, useNavigation, useParams } from 'react-router-dom';
import { closeModal } from '../../helperModules/helpers';
import OutletSkeleton from '../skeletons/OutletSkeleton';
import PostSkeleton from '../skeletons/PostSkeleton';
import styles from './DeletePost.module.css';

const DeletePost = () => {
	const { state } = useNavigation();
	const { postId } = useParams();
	if (state !== 'idle') return postId ? <PostSkeleton /> : <OutletSkeleton />;
	return (
		<div>
			<h3>Do you really want to delete this post?</h3>
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
		</div>
	);
};

export default DeletePost;
