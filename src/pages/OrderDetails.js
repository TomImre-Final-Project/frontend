import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { myAxios } from "../api/axios";
import useAuthContext from "../contexts/AuthContext";

export default function OrderDetails() {
    const { user } = useAuthContext();
    const location = useLocation();
    const navigate = useNavigate();
    const [instructions, setInstructions] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Get cart data from navigation state
    const { cart, cartRestaurant, totalAmount } = location.state || {};

    // Redirect if no cart data
    if (!cart || !cartRestaurant) {
        navigate('/');
        return null;
    }

    const handleSubmitOrder = async () => {
        setIsSubmitting(true);
        setError(null);

        try {
            // First, create the order
            const orderData = {
                user_id: user.id,
                restaurant_id: cartRestaurant.id,
                order_date: new Date().toISOString(),
                status: 'pending',
                total_price: Math.round(totalAmount),
                special_instructions: instructions
            };

            const orderResponse = await myAxios.post('/api/orders', orderData);
            const orderId = orderResponse.data.order.id;

            // Then create each order item
            for (const item of cart) {
                const orderItemData = {
                    order_id: orderId,
                    dish_id: item.id,
                    quantity: item.quantity,
                    price: Math.round(item.price * item.quantity)
                };
                await myAxios.post('/api/order-items', orderItemData);
            }

            // Navigate to success page
            navigate('/order-success', { 
                state: { orderId: orderId }
            });

        } catch (err) {
            setError('Hiba történt a rendelés leadása során. Kérjük, próbálja újra.');
            console.error('Order submission error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mt-4">
            <h1>Rendelés részletei</h1>
            
            <div className="row">
                <div className="col-md-8">
                    <div className="card mb-4">
                        <div className="card-header">
                            <h3 className="mb-0">{cartRestaurant.name}</h3>
                        </div>
                        <div className="card-body">
                            <h4>Rendelt ételek:</h4>
                            <ul className="list-group mb-3">
                                {cart.map((item) => (
                                    <li key={item.id} className="list-group-item d-flex justify-content-between">
                                        <div>
                                            <h6 className="my-0">{item.name}</h6>
                                            <small className="text-muted">Mennyiség: {item.quantity}</small>
                                        </div>
                                        <span>{item.price * item.quantity} Ft</span>
                                    </li>
                                ))}
                                <li className="list-group-item d-flex justify-content-between">
                                    <strong>Összesen:</strong>
                                    <strong>{totalAmount} Ft</strong>
                                </li>
                            </ul>

                            <div className="mb-3">
                                <label htmlFor="instructions" className="form-label">
                                    Különleges kérések az étteremnek:
                                </label>
                                <textarea
                                    id="instructions"
                                    className="form-control"
                                    rows="3"
                                    value={instructions}
                                    onChange={(e) => setInstructions(e.target.value)}
                                    placeholder="Pl.: allergiák, különleges kérések..."
                                ></textarea>
                            </div>

                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    {error}
                                </div>
                            )}

                            <div className="d-grid gap-2">
                                <button
                                    className="btn btn-success"
                                    onClick={handleSubmitOrder}
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Feldolgozás...' : 'Rendelés leadása'}
                                </button>
                                <button
                                    className="btn btn-outline-secondary"
                                    onClick={() => navigate('/')}
                                    disabled={isSubmitting}
                                >
                                    Vissza a módosításhoz
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="mb-0">Rendelési információk</h4>
                        </div>
                        <div className="card-body">
                            <p><strong>Rendelő neve:</strong> {user.name}</p>
                            <p><strong>Email:</strong> {user.email}</p>
                            {/* Add more user details if needed */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 