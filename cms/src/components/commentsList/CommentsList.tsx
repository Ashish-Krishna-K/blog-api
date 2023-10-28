import { TComment } from '../../types';
import { getFormattedDate } from '../../helperModules/helpers';
import parse from 'html-react-parser';
import { Link } from 'react-router-dom';
import styles from './CommentsList.module.css';

type TCommentsListProps = {
	postId: string;
	comments: TComment[];
};

const CommentsList = ({ postId, comments }: TCommentsListProps) => {
	return (
		<section id="comments">
			<h2>Comments</h2>
			<ul className={styles.comments}>
				{comments.length > 0 ? (
					comments.map((comment) => {
						if (typeof comment === 'string') return null;
						return (
							<li
								key={comment.id}
								className={styles.comment}
							>
								<div className={styles.authored}>
									<p>
										<strong>{comment.author} says: </strong>
									</p>
									<p className="lighter-shade">
										<em>{getFormattedDate(new Date(comment.createdOn))}</em>
									</p>
								</div>
								<div>{parse(parse(comment.text) as string)}</div>
								<Link
									to={`/post/${postId}/comment/${comment.id}/delete`}
									state={{ comment }}
									className={styles.deleteComment}
								>
									Delete Comment
								</Link>
							</li>
						);
					})
				) : (
					<p>No Comments Yet...</p>
				)}
			</ul>
		</section>
	);
};

export default CommentsList;
