import React, { useState, useEffect } from 'react';
import { myAxios } from '../../api/axios';
import CustomerSubNav from './CustomerSubNav';

export default function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchOrderHistory();
    }, []);

    const fetchOrderHistory = async () => {
        try {
            const response = await myAxios.get('/api/customer/orders/history');
            setOrders(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching order history:', err);
            setError('Hiba történt a rendelési előzmények betöltése közben.');
            setLoading(false);
        }
    };

    const getStatusLabel = (status) => {
        const statusLabels = {
            'delivered': 'Kiszállítva',
            'cancelled': 'Törölve'
        };
        return statusLabels[status] || status;
    };

    if (loading) return <div>Betöltés...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="container mt-4">
            <CustomerSubNav />
            <h2>Korábbi Rendelések</h2>
            
            {orders.length === 0 ? (
                <div className="alert alert-info">
                    Nincsenek korábbi rendelései.
                </div>
            ) : (
                <div className="row">
                    {orders.map((order) => (
                        <div key={order.id} className="col-md-6 mb-4">
                            <div className="card">
                                <div className="card-header d-flex justify-content-between align-items-center">
                                    <h5 className="mb-0">{order.restaurant.name}</h5>
                                    <span className={`badge bg-${order.status === 'delivered' ? 'success' : 'danger'}`}>
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

                                    {order.delivered_at && (
                                        <div className="mt-3">
                                            <strong>Kiszállítva:</strong>
                                            <p className="mb-0">{new Date(order.delivered_at).toLocaleString()}</p>
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