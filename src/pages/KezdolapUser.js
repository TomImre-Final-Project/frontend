import React, { useState, useEffect } from "react";
import useAuthContext from "../contexts/AuthContext";
import { myAxios } from "../api/axios";

export default function KezdolapUser() {
    const { user } = useAuthContext();
    const [restaurants, setRestaurants] = useState([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [dishes, setDishes] = useState([]);

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

    return (
        <div className="container mt-4">
            <h1>Éttermek és Ételeik</h1>
            {/* <p>Bejelentkezett felhasználó: {user == null ? "Nincs bejelentkezett felhasználó!" : user.username}</p> */}

            <div className="row">
                {/* Restaurants List */}
                <div className="col-md-6">
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
                <div className="col-md-6">
                    {selectedRestaurant && (
                        <div>
                            <h2>Ételek - {selectedRestaurant.name}</h2>
                            <div className="list-group">
                                {dishes.map((dish) => (
                                    <div key={dish.id} className="list-group-item">
                                        <h5 className="mb-1">{dish.name}</h5>
                                        <p className="mb-1">{dish.description}</p>
                                        <small>{dish.price} Ft</small>
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
            </div>
        </div>
    );
}
