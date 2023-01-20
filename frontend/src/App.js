import { Outlet, Link } from 'react-router-dom';

export default function App() {
  return (
    <div className="App">
      <header>
        <Link to={'/'}>
          <h1>Personal Blog</h1>
        </Link>
        <Link to={`/cms`}>Dashboard</Link>
      </header>
      <main>
        <Outlet />
      </main>
      <footer>
        <p>Project by Ashish-Krishna-K</p>
      </footer>
    </div>
  );
}
