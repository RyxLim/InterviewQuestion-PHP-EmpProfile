import React from 'react';
import ReactDOM from 'react-dom/client';
import Home from './Pages/Home';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle';

ReactDOM.createRoot(document.getElementById('app')).render(
    <React.StrictMode>
        <Home />
    </React.StrictMode>
)