import { useAsyncValue, Link, Outlet } from 'react-router-dom';
import { TPost } from '../../types';
import { getFormattedDate } from '../../helperModules/helpers';
import parse from 'html-react-parser';
import styles from './ViewPost.module.css';

const Post = () => {
	const post = useAsyncValue() as TPost | undefined;
	if (typeof post === 'undefined') return <p>Post Not Found.</p>;
	const authorFullName = `${post.author.firstName} ${post.author.lastName}`;
	return (
		<>
			<div className={styles.container}>
				<article className={styles.article}>
					<h2>{post.title}</h2>
					<div className={styles.meta}>
						<em className="lighter-shade">
							<p>
								<span>
									Posted on: {getFormattedDate(new Date(post.createdAt))}
								</span>
								<span>By, {authorFullName}</span>
							</p>
							<p>
								Last Updated On: {getFormattedDate(new Date(post.updatedAt))}
							</p>
						</em>
					</div>
					<div className={styles.controls}>
						<Link to={`/post/${post.id}/edit`}>Edit Post</Link>
						<Link to={`/post/${post.id}/delete`}>Delete Post</Link>
					</div>
					<div className={styles.text}>{parse(parse(post.text) as string)}</div>
				</article>
				<hr />
				<ul className={styles.comments}>
					<h3>Comments</h3>
					{post.comments.length > 0 ? (
						post.comments.map((comment) => {
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
										to={`/post/${post.id}/comment/${comment.id}/delete`}
										state={{ comment }}
										className={styles.commentControl}
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
			</div>
			<Outlet />
		</>
	);
};

export default Post;
