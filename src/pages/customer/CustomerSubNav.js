import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function CustomerSubNav() {
    const location = useLocation();
    
    return (
        <nav className="navbar navbar-expand-sm bg-secondary navbar-dark mb-4">
            <div className="container-fluid">
                <ul className="navbar-nav">
                    <li className="navbar-item">
                        <Link 
                            className={`nav-link ${location.pathname.includes('/orders/current') ? 'active' : ''}`} 
                            to="/orders/current"
                        >
                            Aktuális Rendelések
                        </Link>
                    </li>
                    <li className="navbar-item">
                        <Link 
                            className={`nav-link ${location.pathname.includes('/orders/history') ? 'active' : ''}`} 
                            to="/orders/history"
                        >
                            Korábbi Rendelések
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
} 