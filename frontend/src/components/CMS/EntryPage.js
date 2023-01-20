import { useState } from "react";
import { Link, Outlet, useLoaderData } from "react-router-dom";

export default function CMSEntry() {
  const authToken = useLoaderData();

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
          :
          <></>
      }
    </section>
  )
}