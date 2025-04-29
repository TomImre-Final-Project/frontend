import React, { useState, useEffect } from 'react';
import { myAxios } from '../../api/axios';
import CourierSubNav from './CourierSubNav';
import useAuthContext from '../../contexts/AuthContext';

export default function Deliverable() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const { user } = useAuthContext();

    useEffect(() => {
        fetchDeliverableOrders();
    }, []);

    const fetchDeliverableOrders = async () => {
        try {
            const response = await myAxios.get('/api/courier/deliverable');
            setOrders(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching deliverable orders:', err);
            setError(`Failed to fetch deliverable orders: ${err.message}`);
            setLoading(false);
        }
    };

    const handleAcceptOrder = async (orderId) => {
        try {
            await myAxios.post(`/api/courier/accept-order/${orderId}`);
            fetchDeliverableOrders(); // Refresh the list
            setSelectedOrder(null); // Close the modal
        } catch (err) {
            setError(`Failed to accept order: ${err.message}`);
        }
    };

    const handleViewDetails = (order) => {
        setSelectedOrder(order);
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container mt-4">
            <CourierSubNav />
            <h2>Kiszállítható rendelések</h2>
            
            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Étterem</th>
                            <th>Dátum</th>
                            <th>Összeg</th>
                            <th>Műveletek</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.restaurant?.name || 'N/A'}</td>
                                <td>{new Date(order.order_date).toLocaleString()}</td>
                                <td>{order.total_price} Ft</td>
                                <td>
                                    <button 
                                        className="btn btn-info btn-sm me-2"
                                        onClick={() => handleViewDetails(order)}
                                    >
                                        Részletek
                                    </button>
                                    <button 
                                        className="btn btn-success btn-sm"
                                        onClick={() => handleAcceptOrder(order.id)}
                                    >
                                        Elfogadás
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {orders.length === 0 && (
                            <tr>
                                <td colSpan="5" className="text-center">Nincsenek kiszállítható rendelések</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Rendelés részletei</h5>
                                <button 
                                    type="button" 
                                    className="btn-close"
                                    onClick={() => setSelectedOrder(null)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <h6>Rendelés adatai</h6>
                                    <p><strong>ID:</strong> {selectedOrder.id}</p>
                                    <p><strong>Étterem:</strong> {selectedOrder.restaurant?.name || 'N/A'}</p>
                                    <p><strong>Dátum:</strong> {new Date(selectedOrder.order_date).toLocaleString()}</p>
                                    <p><strong>Összeg:</strong> {selectedOrder.total_price} Ft</p>
                                    <p><strong>Státusz:</strong> {selectedOrder.status}</p>
                                </div>
                                
                                <div className="mb-3">
                                    <h6>Felhasználó adatai</h6>
                                    <p><strong>Név:</strong> {selectedOrder.user?.username || 'N/A'}</p>
                                    <p><strong>Email:</strong> {selectedOrder.user?.email || 'N/A'}</p>
                                    <p><strong>Telefonszám:</strong> {selectedOrder.user?.phone || 'N/A'}</p>
                                </div>
                                
                                <div className="mb-3">
                                    <h6>Különleges utasítások</h6>
                                    <p>{selectedOrder.special_instructions || 'Nincs'}</p>
                                </div>
                                
                                <div className="modal-footer">
                                    <button 
                                        type="button" 
                                        className="btn btn-secondary"
                                        onClick={() => setSelectedOrder(null)}
                                    >
                                        Bezárás
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn btn-success"
                                        onClick={() => handleAcceptOrder(selectedOrder.id)}
                                    >
                                        Rendelés elfogadása
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
} 