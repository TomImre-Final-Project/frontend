import React, { useState, useEffect } from 'react';
import { myAxios } from '../../api/axios';
import AdminSubNav from './AdminSubNav';

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingOrder, setEditingOrder] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [editForm, setEditForm] = useState({
        status: '',
        total_price: '',
        special_instructions: ''
    });

    useEffect(() => {
        fetchOrders();
    }, []);

    useEffect(() => {
        if (selectedStatus === 'all') {
            setFilteredOrders(orders);
        } else {
            setFilteredOrders(orders.filter(order => order.status === selectedStatus));
        }
    }, [selectedStatus, orders]);

    const fetchOrders = async () => {
        try {
            const response = await myAxios.get('/api/admin/orders');
            setOrders(response.data);
            setFilteredOrders(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError(`Failed to fetch orders: ${err.message}`);
            setLoading(false);
        }
    };

    const handleEditClick = (order) => {
        setEditingOrder(order);
        setEditForm({
            status: order.status,
            total_price: order.total_price,
            special_instructions: order.special_instructions || ''
        });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await myAxios.put(`/api/admin/orders/${editingOrder.id}`, editForm);
            setEditingOrder(null);
            fetchOrders(); // Refresh the list
        } catch (err) {
            setError(`Failed to update order: ${err.message}`);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleStatusFilterChange = (e) => {
        setSelectedStatus(e.target.value);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container mt-4">
            <AdminSubNav />
            <h2>Rendelések Listája</h2>
            
            {/* Status Filter */}
            <div className="mb-3">
                <label className="form-label">Státusz szűrése:</label>
                <select 
                    className="form-select" 
                    value={selectedStatus} 
                    onChange={handleStatusFilterChange}
                >
                    <option value="all">Összes rendelés</option>
                    <option value="pending">Függőben</option>
                    <option value="confirmed">Megerősítve</option>
                    <option value="preparing">Elkészítés alatt</option>
                    <option value="ready">Készen áll</option>
                    <option value="delivering">Kiszállítás alatt</option>
                    <option value="delivered">Kiszállítva</option>
                    <option value="cancelled">Törölve</option>
                </select>
            </div>

            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Felhasználó</th>
                            <th>Étterem</th>
                            <th>Dátum</th>
                            <th>Státusz</th>
                            <th>Összeg</th>
                            <th>Műveletek</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredOrders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.user?.username || 'N/A'}</td>
                                <td>{order.restaurant?.name || 'N/A'}</td>
                                <td>{new Date(order.order_date).toLocaleString()}</td>
                                <td>{order.status}</td>
                                <td>{order.total_price} Ft</td>
                                <td>
                                    <button 
                                        className="btn btn-primary btn-sm"
                                        onClick={() => handleEditClick(order)}
                                    >
                                        Szerkesztés
                                    </button>
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
                                            <option value="pending">Függőben</option>
                                            <option value="confirmed">Megerősítve</option>
                                            <option value="preparing">Elkészítés alatt</option>
                                            <option value="ready">Készen áll</option>
                                            <option value="delivering">Kiszállítás alatt</option>
                                            <option value="delivered">Kiszállítva</option>
                                            <option value="cancelled">Törölve</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Összeg</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="total_price"
                                            value={editForm.total_price}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Különleges utasítások</label>
                                        <textarea
                                            className="form-control"
                                            name="special_instructions"
                                            value={editForm.special_instructions}
                                            onChange={handleInputChange}
                                            rows="3"
                                        ></textarea>
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