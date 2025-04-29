import React, { useState, useEffect } from 'react';
import { myAxios } from '../../api/axios';
import RestaurantManagerSubNav from './RestaurantManagerSubNav';

export default function IncomingOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingOrder, setEditingOrder] = useState(null);
    const [editForm, setEditForm] = useState({
        status: '',
        special_instructions: ''
    });

    const statusOptions = [
        { value: 'pending', label: 'Függőben' },
        { value: 'confirmed', label: 'Megerősítve' },
        { value: 'ready', label: 'Kész' }
    ];

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await myAxios.get('/api/restaurantmanager/orders');
            setOrders(response.data);
            setError(null);
        } catch (err) {
            setError('Hiba történt a rendelések betöltése közben.');
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = (order) => {
        setEditingOrder(order);
        setEditForm({
            status: order.status,
            special_instructions: order.special_instructions || ''
        });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await myAxios.put(`/api/restaurantmanager/orders/${editingOrder.id}`, editForm);
            fetchOrders();
            setEditingOrder(null);
        } catch (err) {
            setError('Hiba történt a rendelés frissítése közben.');
            console.error('Error updating order:', err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDeclineOrder = async (orderId) => {
        try {
            await myAxios.put(`/api/restaurantmanager/orders/${orderId}`, {
                status: 'cancelled'
            });
            fetchOrders();
        } catch (err) {
            setError('Hiba történt a rendelés visszautasítása közben.');
            console.error('Error declining order:', err);
        }
    };

    if (loading) return <div className="container mt-4">Betöltés...</div>;
    if (error) return <div className="container mt-4 text-danger">{error}</div>;

    return (
        <div className="container mt-4">
            <RestaurantManagerSubNav />
            <h2>Beérkező rendelések</h2>
            
            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Rendelés ID</th>
                            <th>Felhasználó</th>
                            <th>Dátum</th>
                            <th>Státusz</th>
                            <th>Teljes ár</th>
                            <th>Műveletek</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.user?.name}</td>
                                <td>{new Date(order.created_at).toLocaleString()}</td>
                                <td>{order.status}</td>
                                <td>{order.total_price} Ft</td>
                                <td>
                                    <button 
                                        className="btn btn-primary btn-sm me-2"
                                        onClick={() => handleEditClick(order)}
                                        disabled={['ready', 'delivering', 'delivered', 'cancelled'].includes(order.status)}
                                    >
                                        Szerkesztés
                                    </button>
                                    {order.status === 'pending' && (
                                        <button 
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDeclineOrder(order.id)}
                                        >
                                            Visszautasítás
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Edit Modal */}
            {editingOrder && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Rendelés szerkesztése</h5>
                                <button 
                                    type="button" 
                                    className="btn-close"
                                    onClick={() => setEditingOrder(null)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleEditSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Státusz</label>
                                        <select
                                            className="form-control"
                                            name="status"
                                            value={editForm.status}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            {statusOptions.map(option => (
                                                <option key={option.value} value={option.value}>{option.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Speciális instrukciók</label>
                                        <textarea
                                            className="form-control"
                                            name="special_instructions"
                                            value={editForm.special_instructions}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="modal-footer">
                                        <button 
                                            type="button" 
                                            className="btn btn-secondary"
                                            onClick={() => setEditingOrder(null)}
                                        >
                                            Mégse
                                        </button>
                                        <button type="submit" className="btn btn-primary">
                                            Mentés
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 