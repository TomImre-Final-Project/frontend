import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuthContext from "../contexts/AuthContext";
import NavigacioRestaurantManager from "../pages/NavigacioRestaurantManager";

export default function RestaurantManagerLayout() {
    const { user } = useAuthContext();
    return user && user.role === "restaurant_manager" ? (
        <>
            <NavigacioRestaurantManager />
            <Outlet />
        </>
    ) : (
        <Navigate to="/bejelentkezes" />
    );
} 