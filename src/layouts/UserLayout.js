import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuthContext from "../contexts/AuthContext";
import NavigacioUser from "../pages/NavigacioUser";

export default function UserLayout() {
    const { user } = useAuthContext();
    return user && user.role === "customer" ?  <>  <NavigacioUser /> <Outlet /> </> : <Navigate to="/bejelentkezes" />;


}
