import React from 'react';

export default function MainLayout({ children }) {
    return (
        <div className="container-fluid d-flex flex-column min-vh-100">
            <main className="flex-grow-1">{children}</main>
            <footer className="text-center py-3">&copy; 2024 PH</footer>
        </div>
    );
}