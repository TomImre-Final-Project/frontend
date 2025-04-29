import React, { useState, useEffect } from "react";
import useAuthContext from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { myAxios } from "../api/axios";
import { useNavigate } from 'react-router-dom';

export default function KezdolapUser() {
    const { user } = useAuthContext();
    const { cart, cartRestaurant, addToCart, removeFromCart, updateQuantity, emptyCart, calculateTotal } = useCart();
    const [restaurants, setRestaurants] = useState([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [dishes, setDishes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRestaurants();
    }, []);

    const fetchRestaurants = async () => {
        try {
            const response = await myAxios.get('/api/restaurants');
            setRestaurants(response.data);
        } catch (error) {
            console.error('Error fetching restaurants:', error);
        }
    };

    const fetchDishes = async (restaurantId) => {
        try {
            const response = await myAxios.get(`/api/restaurants/${restaurantId}/dishes`);
            setDishes(response.data);
        } catch (error) {
            console.error('Error fetching dishes:', error);
        }
    };

    const handleRestaurantClick = (restaurant) => {
        setSelectedRestaurant(restaurant);
        fetchDishes(restaurant.id);
    };

    const handleBackToRestaurants = () => {
        setSelectedRestaurant(null);
        setDishes([]);
    };

    const handleProceedToOrder = () => {
        navigate('/order-details', { 
            state: { 
                cart,
                cartRestaurant,
                totalAmount: calculateTotal()
            } 
        });
    };

    return (
        <div className="container mt-4">
            <h1>Éttermek és Ételeik</h1>
            <p>Bejelentkezett felhasználó: {user == null ? "Nincs bejelentkezett felhasználó!" : user.username}</p>
            <div className="row">
                {/* Restaurants List as Cards in 2 columns, hidden when a restaurant is selected */}
                {!selectedRestaurant && (
                    <div className="col-md-9">
                        <h2>Éttermek</h2>
                        <div className="row">
                            {restaurants.filter(r => r.status === 'active').map((restaurant) => (
                                <div key={restaurant.id} className="col-md-6 mb-3">
                                    <div
                                        className="card h-100"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => handleRestaurantClick(restaurant)}
                                    >
                                        <div className="card-body">
                                            <h5 className="card-title">{restaurant.name}</h5>
                                            <p className="card-text">{restaurant.address}</p>
                                            <p className="card-text"><small>{restaurant.phone}</small></p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Dishes List as Cards with Back Button */}
                {selectedRestaurant && (
                    <div className="col-md-9">
                        <button className="btn btn-secondary mb-3" onClick={handleBackToRestaurants}>&larr; Vissza az éttermekhez</button>
                        <h2>Ételek - {selectedRestaurant.name}</h2>
                        <div className="row">
                            {dishes.map((dish) => (
                                <div key={dish.id} className="col-md-6 mb-3">
                                    <div className="card h-100">
                                        {dish.image && (
                                            <img
                                                src={`${process.env.REACT_APP_API_URL}/storage/${dish.image}`}
                                                className="card-img-top"
                                                alt={dish.name}
                                                style={{ height: '160px', objectFit: 'cover' }}
                                            />
                                        )}
                                        <div className="card-body d-flex flex-column">
                                            <h5 className="card-title">{dish.name}</h5>
                                            <p className="card-text">{dish.description}</p>
                                            <div className="mt-auto d-flex justify-content-between align-items-center">
                                                <span><strong>{dish.price} Ft</strong></span>
                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() => addToCart(dish, selectedRestaurant)}
                                                >
                                                    Kosárba
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {dishes.length === 0 && (
                                <div className="col-12">
                                    <div className="alert alert-info">Nincsenek elérhető ételek ebben az étteremben.</div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Shopping Cart */}
                <div className="col-md-3">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <h2 className="mb-0">Kosár</h2>
                            {cart.length > 0 && (
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={emptyCart}
                                >
                                    Kosár ürítése
                                </button>
                            )}
                        </div>
                        <div className="card-body">
                            {cartRestaurant && (
                                <h5 className="mb-3">{cartRestaurant.name}</h5>
                            )}
                            {cart.length === 0 ? (
                                <p>A kosár üres</p>
                            ) : (
                                <>
                                    <ul className="list-group mb-3">
                                        {cart.map((item) => (
                                            <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                                                <div>
                                                    <h6 className="my-0">{item.name}</h6>
                                                    <small className="text-muted">{item.price} Ft</small>
                                                </div>
                                                <div className="d-flex align-items-center">
                                                    <button
                                                        className="btn btn-outline-secondary btn-sm me-2"
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    >
                                                        -
                                                    </button>
                                                    <span>{item.quantity}</span>
                                                    <button
                                                        className="btn btn-outline-secondary btn-sm ms-2"
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    >
                                                        +
                                                    </button>
                                                    <button
                                                        className="btn btn-outline-danger btn-sm ms-2"
                                                        onClick={() => removeFromCart(item.id)}
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="d-flex justify-content-between">
                                        <h5>Összesen:</h5>
                                        <h5>{calculateTotal()} Ft</h5>
                                    </div>
                                    <button
                                        className="btn btn-success w-100 mt-3"
                                        onClick={handleProceedToOrder}
                                    >
                                        Tovább a rendeléshez
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
