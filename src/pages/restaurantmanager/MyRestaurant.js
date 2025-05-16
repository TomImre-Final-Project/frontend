import React, { useState, useEffect } from 'react';
import { myAxios } from '../../api/axios';
import RestaurantManagerSubNav from './RestaurantManagerSubNav';

export default function MyRestaurant() {
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editForm, setEditForm] = useState({
        name: '',
        address: '',
        phone: '',
        status: 'active'
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchRestaurant();
    }, []);

    const fetchRestaurant = async () => {
        try {
            const response = await myAxios.get('/api/restaurantmanager/restaurant');
            setRestaurant(response.data);
            setEditForm({
                name: response.data.name,
                address: response.data.address,
                phone: response.data.phone,
                status: response.data.status
            });
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch restaurant details');
            setLoading(false);
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await myAxios.put('/api/restaurantmanager/restaurant', editForm);
            setIsEditing(false);
            fetchRestaurant();
        } catch (err) {
            setError('Failed to update restaurant details');
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleStatusToggle = async () => {
        try {
            const newStatus = restaurant.status === 'active' ? 'inactive' : 'active';
            await myAxios.put('/api/restaurantmanager/restaurant', {
                ...restaurant,
                status: newStatus
            });
            fetchRestaurant();
        } catch (err) {
            setError('Hiba történt a státusz módosítása közben.');
            console.error('Error updating restaurant status:', err);
        }
    };

    if (loading) return <div className="container mt-4">Betöltés...</div>;
    if (error) return <div className="container mt-4 text-danger">{error}</div>;
    if (!restaurant) return <div className="container mt-4">Nem található étterem</div>;

    return (
        <div className="container mt-4">
            <RestaurantManagerSubNav />
            <h2>Éttermem</h2>
            
            {!isEditing ? (
                <div className="card">
                    <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h3>{restaurant.name}</h3>
                            <div className="d-flex align-items-center gap-3">
                                <div className="form-check form-switch">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="statusToggle"
                                        checked={restaurant.status === 'active'}
                                        onChange={handleStatusToggle}
                                    />
                                    <label className="form-check-label" htmlFor="statusToggle">
                                        {restaurant.status === 'active' ? 'Aktív' : 'Inaktív'}
                                    </label>
                                </div>
                                <button 
                                    className="btn btn-primary"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Edit
                                </button>
                            </div>
                        </div>
                        <p className="card-text">
                            <strong>Address:</strong> {restaurant.address}<br />
                            <strong>Phone:</strong> {restaurant.phone}<br />
                            <strong>Status:</strong> {restaurant.status}<br />
                        </p>
                    </div>
                </div>
            ) : (
                <div className="card">
                    <div className="card-body">
                        <form onSubmit={handleEditSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    value={editForm.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Address</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="address"
                                    value={editForm.address}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Phone</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="phone"
                                    value={editForm.phone}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Status</label>
                                <select
                                    className="form-control"
                                    name="status"
                                    value={editForm.status}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                            <div className="d-flex gap-2">
                                <button 
                                    type="button" 
                                    className="btn btn-secondary"
                                    onClick={() => setIsEditing(false)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
} 