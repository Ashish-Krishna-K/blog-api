import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
import CMSEntry from "./components/CMS/EntryPage";
import Login from "./components/CMS/LoginPage";
import SignUp from "./components/CMS/SignupPage";
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
    ]
  },

]);


export {
  router,
  RouterProvider
}