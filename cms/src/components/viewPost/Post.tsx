import { useAsyncValue, Link, Outlet } from 'react-router-dom';
import { TComment, TPost } from '../../types';
import { getFormattedDate } from '../../helperModules/helpers';
import parse from 'html-react-parser';
import styles from './ViewPost.module.css';
import PublishPost from '../publishPost/PublishPost';
import CommentsList from '../commentsList/CommentsList';

const Post = () => {
	const post = useAsyncValue() as TPost | undefined;
	if (typeof post === 'undefined') return <p>Post Not Found.</p>;
	const authorFullName = `${post.author.firstName} ${post.author.lastName}`;
	return (
		<>
			<div className={styles.container}>
				<section id="article">
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
							<PublishPost
								postId={post.id}
								isPublished={post.isPublished}
							/>
							<Link to={`/post/${post.id}/delete`}>Delete Post</Link>
						</div>
						<div className={styles.text}>
							{parse(parse(post.text) as string)}
						</div>
					</article>
				</section>
				<hr />
				{typeof post.comments[0] !== 'string' && (
					<CommentsList
						postId={post.id}
						comments={post.comments as TComment[]}
					/>
				)}
			</div>
			<Outlet />
		</>
	);
};

export default Post;
