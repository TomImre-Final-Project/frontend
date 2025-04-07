import React from "react";
import { Link } from "react-router-dom";
import useAuthContext from "../contexts/AuthContext";

export default function NavigacioRestaurantManager() {
    const { user, logout } = useAuthContext();

    return (
        <nav className="navbar navbar-expand-sm bg-light">
            <div className="container-fluid">
                <ul className="navbar-nav me-auto">
                    <li className="navbar-item">
                        <Link className="nav-link" to="/">
                            Kezdőlap
                        </Link>
                    </li>
                    <li className="navbar-item">
                        <Link className="nav-link" to="/restaurant">
                            Étterem Kezelése
                        </Link>
                    </li>
                    <li className="navbar-item">
                        <button className="nav-link" onClick={() => { logout() }}>
                            Kijelentkezés
                        </button>
                    </li>
                </ul>
                <ul className="navbar-nav">
                    <li className="navbar-item">
                        <Link className="nav-link" to="/profile">
                            {user.username}
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
} 