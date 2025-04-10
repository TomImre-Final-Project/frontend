import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthContext from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { myAxios } from "../api/axios";

export default function OrderDetails() {
    const { user } = useAuthContext();
    const { cart, cartRestaurant, calculateTotal, emptyCart } = useCart();
    const [instructions, setInstructions] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            // First, create the order
            const orderData = {
                user_id: user.id,
                restaurant_id: cartRestaurant.id,
                order_date: new Date().toISOString(),
                status: 'pending',
                total_price: Math.round(calculateTotal()),
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

            // Clear the cart after successful order
            emptyCart();

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
                                    <strong>{calculateTotal()} Ft</strong>
                                </li>
                            </ul>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="instructions" className="form-label">
                                        Megjegyzés a rendeléshez:
                                    </label>
                                    <textarea
                                        className="form-control"
                                        id="instructions"
                                        rows="3"
                                        value={instructions}
                                        onChange={(e) => setInstructions(e.target.value)}
                                        placeholder="Például: extra csípős, allergia, stb."
                                    ></textarea>
                                </div>

                                {error && (
                                    <div className="alert alert-danger" role="alert">
                                        {error}
                                    </div>
                                )}

                                <div className="d-flex justify-content-between">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => navigate(-1)}
                                    >
                                        Vissza a módosításhoz
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Feldolgozás...' : 'Rendelés leadása'}
                                    </button>
                                </div>
                            </form>
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 