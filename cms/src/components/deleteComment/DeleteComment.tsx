import { Form, useLocation, useNavigation } from 'react-router-dom';
import { TComment } from '../../types';
import { getFormattedDate, closeModal } from '../../helperModules/helpers';
import PostSkeleton from '../skeletons/PostSkeleton';
import styles from './DeleteComment.module.css';

type LocationState = { state: { comment: TComment } };

const DeleteComment = () => {
	const navigation = useNavigation();
	const { state } = useLocation() as LocationState;
	const { comment } = state;
	if (navigation.state !== 'idle') return <PostSkeleton />;
	return (
		<>
			<h3>Do you really want to delete this comment?</h3>
			{typeof comment === 'string' ? null : (
				<div className={styles.comment}>
					<div className={styles.authored}>
						<p>
							<strong>{comment.author}</strong> <em>says:</em>
						</p>
						<p className="lighter-shade">
							<em>{getFormattedDate(new Date(comment.createdOn))}</em>
						</p>
					</div>
					<p>{comment.text}</p>
				</div>
			)}
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

export default DeleteComment;
