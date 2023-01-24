import { useEffect, useState } from "react";
import { Link, Navigate, Outlet } from "react-router-dom";
import { getAuthTokenFromLocalStorage } from "../../helperModule";

export default function CMSEntry() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = getAuthTokenFromLocalStorage();
    if (token) {
      setIsLoggedIn(true);
    }
  }, [])

  return (
    <section className="entry-page flex-vertical">
      {
        !isLoggedIn ?
          <>
            <h2>Login</h2>
            <div className="flex-horizontal links">
              <Link to={`/cms/login`}>Login</Link>
              <Link to={`/cms/signup`}>SignUp</Link>
            </div>
            <Outlet />
          </>
          : <Navigate replace to="/cms_dashboard/posts" />
      }
    </section>
  )
}