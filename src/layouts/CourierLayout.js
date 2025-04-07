import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuthContext from "../contexts/AuthContext";
import NavigacioCourier from "../pages/NavigacioCourier";

export default function CourierLayout() {
    const { user } = useAuthContext();
    return user && user.role === "courier" ? (
        <>
            <NavigacioCourier />
            <Outlet />
        </>
    ) : (
        <Navigate to="/bejelentkezes" />
    );
} 