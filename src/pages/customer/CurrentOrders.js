import React, { useState, useEffect } from 'react';
import { myAxios } from '../../api/axios';
import CustomerSubNav from './CustomerSubNav';

export default function CurrentOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchCurrentOrders();
        // Set up polling every 30 seconds to check for updates
        const interval = setInterval(fetchCurrentOrders, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchCurrentOrders = async () => {
        try {
            const response = await myAxios.get('/api/customer/orders/current');
            setOrders(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching current orders:', err);
            setError('Hiba történt a rendelések betöltése közben.');
            setLoading(false);
        }
    };

    const getStatusLabel = (status) => {
        const statusLabels = {
            'pending': 'Függőben',
            'confirmed': 'Megerősítve',
            'preparing': 'Elkészítés alatt',
            'ready': 'Készen áll',
            'delivering': 'Kiszállítás alatt'
        };
        return statusLabels[status] || status;
    };

    if (loading) return <div>Betöltés...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="container mt-4">
            <CustomerSubNav />
            <h2>Aktuális Rendelések</h2>
            
            {orders.length === 0 ? (
                <div className="alert alert-info">
                    Nincsenek aktív rendelései.
                </div>
            ) : (
                <div className="row">
                    {orders.map((order) => (
                        <div key={order.id} className="col-md-6 mb-4">
                            <div className="card">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0">{order.restaurant.name}</h5>
                                    <span className={`badge bg-${getStatusColor(order.status)}`}>
                                        {getStatusLabel(order.status)}
                                    </span>
                                </div>
                                <div className="card-body">
                                    <p><strong>Rendelés dátuma:</strong> {new Date(order.order_date).toLocaleString()}</p>
                                    <p><strong>Összesen:</strong> {order.total_price} Ft</p>
                                    
                                    <h6>Rendelt ételek:</h6>
                                    <ul className="list-group list-group-flush">
                                        {order.order_items.map((item) => (
                                            <li key={item.id} className="list-group-item d-flex justify-content-between">
                                                <span>{item.dish.name} x {item.quantity}</span>
                                                <span>{item.price} Ft</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {order.special_instructions && (
                                        <div className="mt-3">
                                            <strong>Megjegyzés:</strong>
                                            <p className="mb-0">{order.special_instructions}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function getStatusColor(status) {
    const statusColors = {
        'pending': 'warning',
        'confirmed': 'info',
        'preparing': 'primary',
        'ready': 'success',
        'delivering': 'primary'
    };
    return statusColors[status] || 'secondary';
} 