import { Await, useLoaderData, useNavigation } from 'react-router-dom';
import type { PostLoaderPromise } from '../../types';
import { Suspense } from 'react';
import AsyncError from '../errorPage/AsyncError';
import EditForm from './EditForm';
import PostSkeleton from '../skeletons/PostSkeleton';

const EditPost = () => {
	const { state } = useNavigation();
	const { post } = useLoaderData() as PostLoaderPromise;
	if (state !== 'idle') return <PostSkeleton />;
	return (
		<Suspense fallback={<PostSkeleton />}>
			<Await
				resolve={post}
				errorElement={<AsyncError />}
			>
				<EditForm />
			</Await>
		</Suspense>
	);
};

export default EditPost;
