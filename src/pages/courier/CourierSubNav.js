import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function CourierSubNav() {
    const location = useLocation();

    return (
        <nav className="navbar navbar-expand-sm bg-secondary navbar-dark mb-4">
            <div className="container-fluid">
                <ul className="navbar-nav">
                    <li className="navbar-item">
                        <Link 
                            className={`nav-link ${location.pathname === '/courier/deliverable' ? 'active' : ''}`} 
                            to="/courier/deliverable"
                        >
                            Kiszállítható rendelések
                        </Link>
                    </li>
                    <li className="navbar-item">
                        <Link 
                            className={`nav-link ${location.pathname === '/courier/my-deliveries' ? 'active' : ''}`} 
                            to="/courier/my-deliveries"
                        >
                            Saját kiszállítások
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
} 