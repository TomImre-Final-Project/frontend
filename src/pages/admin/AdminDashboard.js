import React from "react";
import AdminSubNav from "./AdminSubNav";

export default function AdminDashboard() {
    return (
        <div className="container mt-4">
            <AdminSubNav />
            <h2>Admin Vezérlőpult</h2>
            <p>Válassz egy opciót a fenti menüből a kezeléshez.</p>
        </div>
    );
} 