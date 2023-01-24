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
          <section className="cms-dashboard-header">
            <button onClick={handleLogout}>Logout</button>
            <button>
              <Link to="/cms_dashboard/create_post">Create New Post</Link>
            </button>
            <button>
              <Link to="/cms_dashboard/posts">Posts</Link>
            </button>
            <button>
              <Link to="/cms_dashboard/comments">Comments</Link>
            </button>
          </section>
          <section>
            <Outlet />
          </section>
        </>
      }
    </div>
  )
}