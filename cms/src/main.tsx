import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Router from './components/routes/Router.tsx';

const root = document.createElement('div');
root.id = 'root';

ReactDOM.createRoot(document.getElementById('root') ?? root).render(
	<React.StrictMode>
		<Router />
	</React.StrictMode>,
);
