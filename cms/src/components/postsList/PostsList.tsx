import { useAsyncValue, Link } from 'react-router-dom';
import type { PostsData } from '../../types';
import { getFormattedDate } from '../../helperModules/helpers';
import parse from 'html-react-parser';
import styles from './PostsList.module.css';
import PublishPost from '../publishPost/PublishPost';
import { HashLink } from 'react-router-hash-link';
import HomeNavLinks from '../homeNavLinks/HomeNavLinks';

const PostsList = () => {
	const data = useAsyncValue() as PostsData | undefined;
	// The API can potentially return an empty array when there is no valid search
	// results for the query, handling such case along with potential undefined being
	// returned
	if (typeof data === 'undefined' || (Array.isArray(data) && data.length < 1)) {
		return <p>There is no posts.</p>;
	}
	const { previousCount, nextCount, posts } = data;
	// set the previous and next cursors
	const previousCursor =
		previousCount > 0 ? new Date(posts[0].createdAt).getTime() : undefined;
	const nextCursor =
		nextCount > 0 ? new Date(posts[4].createdAt).getTime() : undefined;
	return (
		<div className={styles.container}>
			<HomeNavLinks
				prevCursor={previousCursor}
				nextCursor={nextCursor}
			/>
			<hr />
			<ul className={styles.list}>
				{posts.map((post) => (
					<li
						key={post.id}
						className={`${styles.post} ${
							// add the unpublished class if post isPublished is false
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
							{/* Parse the text twiced becuase the first parse will unescape the 
							escaped HTML characters and second parse will actually render it */}
							{parse(parse(post.text) as string)}
						</div>
						<div className={styles.controls}>
							<p>
								{/* clicking on the comments will open the post and navigate to the
								comments section */}
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
			<HomeNavLinks
				prevCursor={previousCursor}
				nextCursor={nextCursor}
			/>
		</div>
	);
};

export default PostsList;
