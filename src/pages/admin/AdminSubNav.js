import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function AdminSubNav() {
    const location = useLocation();
    
    return (
        <nav className="navbar navbar-expand-sm bg-secondary navbar-dark mb-4">
            <div className="container-fluid">
                <ul className="navbar-nav">
                    <li className="navbar-item">
                        <Link 
                            className={`nav-link ${location.pathname === '/admin/restaurants' ? 'active' : ''}`} 
                            to="/admin/restaurants"
                        >
                            Éttermek
                        </Link>
                    </li>
                    <li className="navbar-item">
                        <Link 
                            className={`nav-link ${location.pathname === '/admin/users' ? 'active' : ''}`} 
                            to="/admin/users"
                        >
                            Felhasználók
                        </Link>
                    </li>
                    <li className="navbar-item">
                        <Link 
                            className={`nav-link ${location.pathname === '/admin/orders' ? 'active' : ''}`} 
                            to="/admin/orders"
                        >
                            Rendelések
                        </Link>
                    </li>
                    <li className="navbar-item">
                        <Link 
                            className={`nav-link ${location.pathname === '/admin/statistics' ? 'active' : ''}`} 
                            to="/admin/statistics"
                        >
                            Statisztikák
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
} 