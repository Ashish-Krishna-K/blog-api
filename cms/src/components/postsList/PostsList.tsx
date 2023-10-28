import { useAsyncValue, Link } from 'react-router-dom';
import { PostsData } from '../../types';
import { getFormattedDate } from '../../helperModules/helpers';
import parse from 'html-react-parser';
import styles from './PostsList.module.css';
import PublishPost from '../publishPost/PublishPost';
import { HashLink } from 'react-router-hash-link';

const PostsList = () => {
	const data = useAsyncValue() as PostsData | undefined;
	if (typeof data === 'undefined' || (Array.isArray(data) && data.length < 1))
		return <p>There is no posts.</p>;
	const { previousCount, nextCount, posts } = data;
	const previousCursor =
		previousCount > 0 ? new Date(posts[0].createdAt).getTime() : undefined;
	const nextCursor =
		nextCount > 0 ? new Date(posts[4].createdAt).getTime() : undefined;
	return (
		<div className={styles.container}>
			<nav className={styles.navLinks}>
				{previousCursor && (
					<Link
						to={`/?f=${previousCursor}&d=prev`}
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
			<hr />
			<ul className={styles.list}>
				{posts.map((post) => (
					<li
						key={post.id}
						className={`${styles.post} ${
							!post.isPublished && styles.unpublished
						}`}
					>
						<div>
							<Link
								to={`/post/${post.id}`}
								className={styles.title}
							>
								<h3>{post.title}</h3>
							</Link>
							<p className={styles.meta}>
								<em>
									<span>
										Posted on, {getFormattedDate(new Date(post.createdAt))}
									</span>
									<span>
										by, {`${post.author.firstName} ${post.author.lastName}`}
									</span>
								</em>
							</p>
						</div>
						<div className={styles.text}>
							{parse(parse(post.text) as string)}
						</div>
						<div className={styles.controls}>
							<p>
								<HashLink
									smooth
									to={`/post/${post.id}#comments`}
								>
									Comments: {post.comments.length}
								</HashLink>
							</p>
							<p>
								<Link to={`/post/${post.id}/edit`}>Edit Post</Link>
							</p>
							<PublishPost
								postId={post.id}
								isPublished={post.isPublished}
							/>
							<p>
								<Link to={`/post/${post.id}/delete`}>Delete Post</Link>
							</p>
						</div>
					</li>
				))}
			</ul>
			<hr />
			<nav className={styles.navLinks}>
				{previousCursor && (
					<Link
						to={`/?f=${previousCursor}&d=prev`}
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
		</div>
	);
};

export default PostsList;
