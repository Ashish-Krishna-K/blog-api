import { useLoaderData, useNavigation, Await } from 'react-router-dom';
import { PostLoaderPromise } from '../../types';
import { Suspense } from 'react';
import AsyncError from '../errorPage/AsyncError';
import Post from './Post';
import PostSkeleton from '../skeletons/PostSkeleton';

const ViewPost = () => {
	const { post } = useLoaderData() as PostLoaderPromise;
	const { state } = useNavigation();
	if (state !== 'idle') return <PostSkeleton />;
	return (
		<Suspense fallback={<PostSkeleton />}>
			<Await
				resolve={post}
				errorElement={<AsyncError />}
			>
				<Post />
			</Await>
		</Suspense>
	);
};

export default ViewPost;
