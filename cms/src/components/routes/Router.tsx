import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Login from '../loginPage/Login';
import { action as loginAction } from '../loginPage/loginAction';
import App from '../app/App';
import Home from '../homePage/Home';
import { loader as homeLoader } from '../homePage/homeLoader';
import { loader as postLoader } from '../viewPost/postLoader';
import ViewPost from '../viewPost/ViewPost';
import ModalRoute from '../modalRoute/ModalRoute';
import DeletePost from '../deletePost/DeletePost';
import { action as deletePostAction } from '../deletePost/deletePostAction';
import CreatePost from '../createPost/CreatePost';
import { action as createPostAction } from '../createPost/createPostAction';
import EditPost from '../editPost/EditPost';
import { action as editPostAction } from '../editPost/editPostAction';
import DeleteComment from '../deleteComment/DeleteComment';
import { action as deleteCommentAction } from '../deleteComment/deleteCommentAction';
import Logout from '../logoutPage/LogoutPage';
import { action as logoutAction } from '../logoutPage/logoutAction';
import ErrorPage from '../errorPage/ErrorPage';
import FullPageSkeleton from '../skeletons/FullPageSkeleton';

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
