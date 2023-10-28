import { useFetcher } from 'react-router-dom';
import styles from './PublishPost.module.css';

type TPublishPostProps = {
	postId: string;
	isPublished: boolean;
};

const PublishPost = ({ postId, isPublished }: TPublishPostProps) => {
	// Publish post action won't cause a navigation, hence using a fetcher.
	const fetcher = useFetcher();
	return (
		<fetcher.Form
			className={styles.form}
			method="put"
			action={`/post/${postId}/publish`}
		>
			<input
				type="hidden"
				name="postId"
				value={postId}
			/>
			<button
				type="submit"
				className={isPublished ? styles.unpublish : styles.publish}
			>
				{isPublished ? 'Unpublish Post' : 'Publish Post'}
			</button>
		</fetcher.Form>
	);
};

export default PublishPost;
