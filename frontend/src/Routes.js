import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
import CreatePost from "./components/CMS/CreatePost";
import CMSDashboard from "./components/CMS/Dashboard";
import CMSEntry from "./components/CMS/EntryPage";
import Login from "./components/CMS/LoginPage";
import SignUp from "./components/CMS/SignupPage";
import DashboardComments from "./components/CMS/DashboardComments";
import DashboardPosts from "./components/CMS/DashboardPosts";
import Home from "./components/HomePage";
import ErrorPage from './ErrorPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <Home />,
        errorElement: <ErrorPage />,
      },
      {
        path: "/cms",
        element: <CMSEntry />,
        errorElement: <ErrorPage />,
        children: [
          {
            path: "/cms/signup",
            element: <SignUp />,
            errorElement: <ErrorPage />,
          },
          {
            path: "/cms/login",
            element: <Login />,
            errorElement: <ErrorPage />,
          },
        ]
      },
      {
        path: "/cms_dashboard",
        element: <CMSDashboard />,
        errorElement: <ErrorPage />,
        children: [
          {
            path: "/cms_dashboard/posts",
            element: <DashboardPosts />,
            errorElement: <ErrorPage />
          },
          {
            path: "/cms_dashboard/comments",
            element: <DashboardComments />,
            errorElement: <ErrorPage />
          },
          {
            path: "/cms_dashboard/create_post",
            element: <CreatePost />,
            errorElement: <ErrorPage />
          },
        ]
      }
    ]
  },

]);


export {
  router,
  RouterProvider
}