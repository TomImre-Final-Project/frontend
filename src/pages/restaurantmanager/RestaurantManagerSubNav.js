import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function RestaurantManagerSubNav() {
    const location = useLocation();

    return (
        <nav className="navbar navbar-expand-sm bg-secondary navbar-dark mb-4">
            <div className="container-fluid">
                <ul className="navbar-nav">
                    <li className="navbar-item">
                        <Link 
                            className={`nav-link ${location.pathname === '/restaurantmanager/restaurant' ? 'active' : ''}`} 
                            to="/restaurantmanager/restaurant"
                        >
                            Éttermem kezelése
                        </Link>
                    </li>
                    <li className="navbar-item">
                        <Link 
                            className={`nav-link ${location.pathname === '/restaurantmanager/dishes' ? 'active' : ''}`} 
                            to="/restaurantmanager/dishes"
                        >
                            Ételek
                        </Link>
                    </li>
                    <li className="navbar-item">
                        <Link 
                            className={`nav-link ${location.pathname === '/restaurantmanager/orders' ? 'active' : ''}`} 
                            to="/restaurantmanager/orders"
                        >
                            Beérkező rendelések
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
} 