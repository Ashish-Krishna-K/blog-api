import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { getAuthTokenFromLocalStorage } from "../../backendInteraction";

export default function CMSEntry() {
  const [authToken, setAuthToken] = useState(null);

  useEffect(() => {
    setAuthToken(getAuthTokenFromLocalStorage());
  }, [authToken])

  return (
    <section>
      {
        !authToken ?
          <>
            <h2>Login</h2>
            <Link to={`/cms/login`}>Login</Link>
            <Link to={`/cms/signup`}>SignUp</Link>
            <Outlet />
          </>
          : <p>hi user</p>
      }
    </section>
  )
}