import { Await, useLoaderData, useNavigation } from 'react-router-dom';
import { Suspense } from 'react';
import { HomeLoaderPromise } from '../../types';
import PostsList from '../postsList/PostsList';
import AsyncError from '../errorPage/AsyncError';
import OutletSkeleton from '../skeletons/OutletSkeleton';

const Home = () => {
	const { posts } = useLoaderData() as HomeLoaderPromise;
	const { state } = useNavigation();
	return (
		<>
			<h2>Recent Posts</h2>
			{state !== 'idle' ? (
				<OutletSkeleton />
			) : (
				<Suspense fallback={<OutletSkeleton />}>
					<Await
						resolve={posts}
						errorElement={<AsyncError />}
					>
						<PostsList />
					</Await>
				</Suspense>
			)}
		</>
	);
};

export default Home;
