import React, { useState, useEffect } from 'react';
import { myAxios } from '../../api/axios';
import AdminSubNav from './AdminSubNav';

export default function Restaurants() {
    const [restaurants, setRestaurants] = useState([]);
    const [managers, setManagers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingRestaurant, setEditingRestaurant] = useState(null);
    const [editForm, setEditForm] = useState({
        name: '',
        address: '',
        phone: '',
        status: 'active',
        manager_id: null
    });

    useEffect(() => {
        fetchRestaurants();
        fetchManagers();
    }, []);

    const fetchRestaurants = async () => {
        try {
            const response = await myAxios.get('/api/restaurants');
            setRestaurants(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch restaurants');
            setLoading(false);
        }
    };

    const fetchManagers = async () => {
        try {
            const response = await myAxios.get('/api/admin/users');
            // Filter only restaurant managers
            const restaurantManagers = response.data.filter(user => user.role === 'restaurant_manager');
            setManagers(restaurantManagers);
        } catch (err) {
            setError('Failed to fetch managers');
        }
    };

    const handleEditClick = (restaurant) => {
        setEditingRestaurant(restaurant);
        setEditForm({
            name: restaurant.name,
            address: restaurant.address,
            phone: restaurant.phone,
            status: restaurant.status,
            manager_id: restaurant.manager_id
        });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await myAxios.put(`/api/admin/restaurants/${editingRestaurant.id}`, editForm);
            setEditingRestaurant(null);
            fetchRestaurants(); // Refresh the list
        } catch (err) {
            setError(`Failed to update restaurant: ${err.message}`);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container mt-4">
            <AdminSubNav />
            <h2>Éttermek Listája</h2>
            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Név</th>
                            <th>Cím</th>
                            <th>Telefonszám</th>
                            <th>Státusz</th>
                            <th>Vezető</th>
                            <th>Műveletek</th>
                        </tr>
                    </thead>
                    <tbody>
                        {restaurants.map((restaurant) => (
                            <tr key={restaurant.id}>
                                <td>{restaurant.name}</td>
                                <td>{restaurant.address}</td>
                                <td>{restaurant.phone}</td>
                                <td>{restaurant.status}</td>
                                <td>
                                    {restaurant.manager ? 
                                        `${restaurant.manager.username} (${restaurant.manager.email})` : 
                                        'Nincs vezető'
                                    }
                                </td>
                                <td>
                                    <button 
                                        className="btn btn-primary btn-sm"
                                        onClick={() => handleEditClick(restaurant)}
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
            {editingRestaurant && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Étterem szerkesztése</h5>
                                <button 
                                    type="button" 
                                    className="btn-close"
                                    onClick={() => setEditingRestaurant(null)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleEditSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Név</label>
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
                                        <label className="form-label">Cím</label>
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
                                        <label className="form-label">Telefonszám</label>
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
                                        <label className="form-label">Státusz</label>
                                        <select
                                            className="form-control"
                                            name="status"
                                            value={editForm.status}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="active">Aktív</option>
                                            <option value="inactive">Inaktív</option>
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Vezető</label>
                                        <select
                                            className="form-control"
                                            name="manager_id"
                                            value={editForm.manager_id || ''}
                                            onChange={handleInputChange}
                                        >
                                            <option value="">Nincs vezető</option>
                                            {managers.map(manager => (
                                                <option key={manager.id} value={manager.id}>
                                                    {manager.username} ({manager.email})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="modal-footer">
                                        <button 
                                            type="button" 
                                            className="btn btn-secondary"
                                            onClick={() => setEditingRestaurant(null)}
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