import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import "bulma/css/bulma.css";
import "font-awesome/css/font-awesome.css";
import { register as registerServiceWorker } from './serviceWorkerRegistration';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
        <App />
    </BrowserRouter>
  </React.StrictMode>
);

registerServiceWorker();