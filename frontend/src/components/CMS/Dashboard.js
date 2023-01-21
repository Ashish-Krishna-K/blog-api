import { Link, Outlet, useNavigate } from "react-router-dom";

export default function CMSDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/cms');
  }

  return (
    <div>
      {
        <>
          <section>
            <button onClick={handleLogout}>Logout</button>
            <Link to="/cms_dashboard/create_post">Create New Post</Link>
            <Link to="/cms_dashboard/posts">Posts</Link>
            <Link to="/cms_dashboard/comments">Comments</Link>
          </section>
          <section>
            <Outlet />
          </section>
        </>
      }
    </div>
  )
}