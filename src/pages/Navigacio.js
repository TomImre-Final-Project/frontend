import React from "react";
import { Link } from "react-router-dom";
import useAuthContext from "../contexts/AuthContext";

export default function Navigacio() {
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
                    {user ? (
                        <>
                            {user.role === "admin" && (
                                <li className="navbar-item">
                                    <Link className="nav-link" to="/admin">
                                        Admin Felület
                                    </Link>
                                </li>
                            )}
                            <li className="navbar-item">
                                <button className="nav-link" onClick={()=>{logout()}}>
                                    Kijelentkezés
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="navbar-item">
                                <Link className="nav-link" to="/bejelentkezes">
                                    Bejelentkezés
                                </Link>
                            </li>
                            <li className="navbar-item">
                                <Link className="nav-link" to="/regisztracio">
                                    Regisztráció
                                </Link>
                            </li>
                        </>
                    )}
                </ul>
                {user && (
                    <ul className="navbar-nav">
                        {user.role === "customer" && (
                            <li className="navbar-item">
                                <Link className="nav-link" to="/orders/current">
                                    Rendeléseim
                                </Link>
                            </li>
                        )}
                        <li className="navbar-item">
                            <Link className="nav-link" to="/profile">
                                {user.username}
                            </Link>
                        </li>
                    </ul>
                )}
            </div>
        </nav>
    );
}
