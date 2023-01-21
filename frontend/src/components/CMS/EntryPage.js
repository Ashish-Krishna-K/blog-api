import { useEffect, useState } from "react";
import { Link, Navigate, Outlet } from "react-router-dom";
import { getAuthTokenFromLocalStorage } from "../../backendInteraction";

export default function CMSEntry() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = getAuthTokenFromLocalStorage();
    if (token) {
      setIsLoggedIn(true);
    }
  }, [])

  return (
    <section>
      {
        !isLoggedIn ?
          <>
            <h2>Login</h2>
            <Link to={`/cms/login`}>Login</Link>
            <Link to={`/cms/signup`}>SignUp</Link>
            <Outlet />
          </>
          : <Navigate replace to="/cms_dashboard/posts" />
      }
    </section>
  )
}