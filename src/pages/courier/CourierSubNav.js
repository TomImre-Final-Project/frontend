import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function CourierSubNav() {
    const location = useLocation();

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
            <div className="container-fluid">
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#courierNavbar" aria-controls="courierNavbar" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="courierNavbar">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
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
            </div>
        </nav>
    );
} 