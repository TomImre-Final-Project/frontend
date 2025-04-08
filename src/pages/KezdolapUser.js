import React, { useState, useEffect } from "react";
import useAuthContext from "../contexts/AuthContext";
import { myAxios } from "../api/axios";

export default function KezdolapUser() {
    const { user } = useAuthContext();
    const [restaurants, setRestaurants] = useState([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [dishes, setDishes] = useState([]);
    const [cart, setCart] = useState([]);
    const [cartRestaurant, setCartRestaurant] = useState(null);

    // Fetch restaurants when component mounts
    useEffect(() => {
        fetchRestaurants();
    }, []);

    // Fetch dishes when a restaurant is selected
    useEffect(() => {
        if (selectedRestaurant) {
            fetchDishes(selectedRestaurant.id);
        }
    }, [selectedRestaurant]);

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
    };

    const addToCart = (dish) => {
        // Check if cart is empty or if the dish is from the same restaurant
        if (cart.length === 0) {
            // If cart is empty, set cart restaurant
            setCartRestaurant(selectedRestaurant);
            setCart([{ ...dish, quantity: 1 }]);
        } else if (cartRestaurant && cartRestaurant.id === selectedRestaurant.id) {
            // If dish is from the same restaurant
            const existingDish = cart.find(item => item.id === dish.id);
            if (existingDish) {
                // Increase quantity if dish already in cart
                const updatedCart = cart.map(item => 
                    item.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
                );
                setCart(updatedCart);
            } else {
                // Add new dish to cart
                setCart([...cart, { ...dish, quantity: 1 }]);
            }
        } else {
            // If dish is from different restaurant, confirm replacement
            if (window.confirm('A kosárba csak egy étteremből tehetsz ételeket. Kiürítsük a kosarat és új éttermet válasszunk?')) {
                setCartRestaurant(selectedRestaurant);
                setCart([{ ...dish, quantity: 1 }]);
            }
        }
    };

    const removeFromCart = (dishId) => {
        const updatedCart = cart.filter(item => item.id !== dishId);
        setCart(updatedCart);
        
        // If cart becomes empty, reset cart restaurant
        if (updatedCart.length === 0) {
            setCartRestaurant(null);
        }
    };

    const updateQuantity = (dishId, newQuantity) => {
        if (newQuantity < 1) return;
        
        const updatedCart = cart.map(item => 
            item.id === dishId ? { ...item, quantity: newQuantity } : item
        );
        setCart(updatedCart);
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const emptyCart = () => {
        setCart([]);
        setCartRestaurant(null);
    };

    return (
        <div className="container mt-4">
            <h1>Éttermek és Ételeik</h1>
            <p>Bejelentkezett felhasználó: {user == null ? "Nincs bejelentkezett felhasználó!" : user.username}</p>

            <div className="row">
                {/* Restaurants List */}
                <div className="col-md-4">
                    <h2>Éttermek</h2>
                    <div className="list-group">
                        {restaurants.map((restaurant) => (
                            <button
                                key={restaurant.id}
                                className={`list-group-item list-group-item-action ${selectedRestaurant?.id === restaurant.id ? 'active' : ''}`}
                                onClick={() => handleRestaurantClick(restaurant)}
                            >
                                {restaurant.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Dishes List */}
                <div className="col-md-4">
                    {selectedRestaurant && (
                        <div>
                            <h2>Ételek - {selectedRestaurant.name}</h2>
                            <div className="list-group">
                                {dishes.map((dish) => (
                                    <div key={dish.id} className="list-group-item">
                                        <h5 className="mb-1">{dish.name}</h5>
                                        <p className="mb-1">{dish.description}</p>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <small>{dish.price} Ft</small>
                                            <button 
                                                className="btn btn-primary btn-sm"
                                                onClick={() => addToCart(dish)}
                                            >
                                                Kosárba
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {dishes.length === 0 && (
                                    <div className="list-group-item">
                                        Nincsenek elérhető ételek ebben az étteremben.
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Shopping Cart */}
                <div className="col-md-4">
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
                                    <button className="btn btn-success w-100 mt-3">
                                        Rendelés leadása
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
