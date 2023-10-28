import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Login from '../loginPage/Login';
import loginAction from '../loginPage/loginAction';
import App from '../app/App';
import Home from '../homePage/Home';
import homeLoader from '../homePage/homeLoader';
import ViewPost from '../viewPost/ViewPost';
import postLoader from '../viewPost/postLoader';
import ModalRoute from '../modalRoute/ModalRoute';
import DeletePost from '../deletePost/DeletePost';
import deletePostAction from '../deletePost/deletePostAction';
import CreatePost from '../createPost/CreatePost';
import createPostAction from '../createPost/createPostAction';
import EditPost from '../editPost/EditPost';
import editPostAction from '../editPost/editPostAction';
import DeleteComment from '../deleteComment/DeleteComment';
import deleteCommentAction from '../deleteComment/deleteCommentAction';
import Logout from '../logoutPage/LogoutPage';
import logoutAction from '../logoutPage/logoutAction';
import FullPageSkeleton from '../skeletons/FullPageSkeleton';
import PublishPostAction from '../publishPost/publishPostAction';
import ErrorPage from '../errorPage/ErrorPage';

const Router = () => {
	const router = createBrowserRouter([
		{
			path: '/',
			element: <App />,
			errorElement: <ErrorPage />,
			children: [
				{
					index: true,
					element: <Home />,
					loader: homeLoader,
				},
				{
					path: 'logout',
					element: (
						<ModalRoute>
							<Logout />
						</ModalRoute>
					),
					action: logoutAction,
				},
				{
					path: 'post/create',
					element: <CreatePost />,
					action: createPostAction,
				},
				{
					path: 'post/:postId',
					element: <ViewPost />,
					loader: postLoader,
					children: [
						{
							path: 'delete',
							element: (
								<ModalRoute>
									<DeletePost />
								</ModalRoute>
							),
							action: deletePostAction,
						},
						{
							path: 'publish',
							action: PublishPostAction,
						},
						{
							path: 'comment/:commentId/delete',
							element: (
								<ModalRoute>
									<DeleteComment />
								</ModalRoute>
							),
							action: deleteCommentAction,
						},
					],
				},
				{
					path: 'post/:postId/edit',
					element: <EditPost />,
					loader: postLoader,
					action: editPostAction,
				},
			],
		},
		{
			path: '/login',
			element: <Login />,
			action: loginAction,
			errorElement: <ErrorPage />,
		},
	]);

	return (
		<RouterProvider
			router={router}
			fallbackElement={<FullPageSkeleton />}
		/>
	);
};

export default Router;
