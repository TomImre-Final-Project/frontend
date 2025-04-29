import React from 'react';
import RestaurantManagerSubNav from './RestaurantManagerSubNav';

export default function RestaurantManagerDashboard() {
    return (
        <div className="container mt-4">
            <RestaurantManagerSubNav />
            <h2>Étterem Vezérlőpult</h2>
            <p>Válassz egy opciót a fenti menüből a kezeléshez.</p>
        </div>
    );
} 