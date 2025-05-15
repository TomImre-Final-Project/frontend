import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import CurrentOrders from './CurrentOrders';
import OrderHistory from './OrderHistory';
import useAuthContext from '../../contexts/AuthContext';

export default function Orders() {
    const { user } = useAuthContext();

    // Redirect to login if not authenticated or not a customer
    if (!user || user.role !== 'customer') {
        return <Navigate to="/bejelentkezes" replace />;
    }

    return (
        <Routes>
            <Route path="current" element={<CurrentOrders />} />
            <Route path="history" element={<OrderHistory />} />
            <Route path="*" element={<Navigate to="current" replace />} />
        </Routes>
    );
} 