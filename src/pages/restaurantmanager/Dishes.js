import React, { useState, useEffect } from 'react';
import { myAxios } from '../../api/axios';
import RestaurantManagerSubNav from './RestaurantManagerSubNav';
console.log('API URL:', process.env.REACT_APP_API_URL);
export default function Dishes() {
    const [dishes, setDishes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingDish, setEditingDish] = useState(null);
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category_id: '',
        ingredients: '',
        is_available: true,
        image: null
    });
    const [showModal, setShowModal] = useState(false);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        fetchDishes();
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await myAxios.get('/api/categories');
            setCategories(response.data);
        } catch (err) {
            setError('Error fetching categories');
        }
    };

    const fetchDishes = async () => {
        try {
            const response = await myAxios.get('/api/restaurantmanager/dishes');
            setDishes(response.data);
            setLoading(false);
        } catch (err) {
            setError('Error fetching dishes');
            setLoading(false);
        }
    };

    const handleEditClick = (dish) => {
        console.log('Editing dish:', dish);
        setEditingDish(dish);
        setFormData({
            name: dish.name || '',
            description: dish.description || '',
            price: dish.price || '',
            category_id: dish.category_id || '',
            ingredients: dish.ingredients || '',
            is_available: dish.is_available || true,
            image: null
        });
        console.log('Form data set to:', {
            name: dish.name || '',
            description: dish.description || '',
            price: dish.price || '',
            category_id: dish.category_id || '',
            ingredients: dish.ingredients || '',
            is_available: dish.is_available || true,
            image: null
        });
        setIsCreating(false);
        setShowModal(true);
    };

    const handleCreateClick = () => {
        setEditingDish(null);
        setFormData({
            name: '',
            description: '',
            price: '',
            category_id: '',
            ingredients: '',
            is_available: true,
            image: null
        });
        setIsCreating(true);
        setShowModal(true);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        setFormData(prev => ({
            ...prev,
            image: e.target.files[0]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isCreating || formData.image) {
                // Use FormData if creating OR if a new image is selected
                const formDataToSend = new FormData();
                formDataToSend.append('name', formData.name);
                formDataToSend.append('description', formData.description);
                formDataToSend.append('price', formData.price);
                formDataToSend.append('category_id', formData.category_id);
                formDataToSend.append('ingredients', formData.ingredients);
                formDataToSend.append('is_available', formData.is_available ? '1' : '0');
                if (formData.image) {
                    formDataToSend.append('image', formData.image);
                }

                if (isCreating) {
                    await myAxios.post('/api/restaurantmanager/dishes', formDataToSend, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });
                } else {
                    await myAxios.post(
                        `/api/restaurantmanager/dishes/${editingDish.id}?_method=PUT`,
                        formDataToSend,
                        { headers: { 'Content-Type': 'multipart/form-data' } }
                    );
                }
            } else {
                // No new image, use JSON
                const updateData = {
                    name: formData.name,
                    description: formData.description,
                    price: formData.price,
                    category_id: formData.category_id,
                    ingredients: formData.ingredients,
                    is_available: formData.is_available
                };
                await myAxios.put(`/api/restaurantmanager/dishes/${editingDish.id}`, updateData);
            }

            setShowModal(false);
            fetchDishes();
            setFormData({
                name: '',
                description: '',
                price: '',
                category_id: '',
                ingredients: '',
                is_available: true,
                image: null
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Error saving dish');
        }
    };

    const handleToggleAvailability = async (dishId, currentStatus) => {
        try {
            await myAxios.put(`/api/restaurantmanager/dishes/${dishId}`, {
                is_available: !currentStatus
            });
            fetchDishes();
        } catch (err) {
            setError(err.response?.data?.message || 'Error updating dish availability');
        }
    };

    if (loading) return <div className="container mt-4">Loading...</div>;
    if (error) return <div className="container mt-4 text-danger">{error}</div>;

    return (
        <div className="container mt-4">
            <RestaurantManagerSubNav />
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Ételek kezelése</h2>
                <button 
                    className="btn btn-primary"
                    onClick={handleCreateClick}
                >
                    Új étel hozzáadása
                </button>
            </div>

            <div className="row">
                {dishes.map(dish => (
                    <div key={dish.id} className="col-md-4 mb-4">
                        <div className="card">
                            {dish.image && (
                                <img 
                                    src={`${process.env.REACT_APP_API_URL}/storage/${dish.image}`} 
                                    className="card-img-top" 
                                    alt={dish.name}
                                    style={{ height: '200px', objectFit: 'cover' }}
                                />
                            )}
                            <div className="card-body">
                                <h5 className="card-title">{dish.name}</h5>
                                <p className="card-text">{dish.description}</p>
                                <p className="card-text"><strong>Ár:</strong> {dish.price} Ft</p>
                                <p className="card-text"><strong>Kategória:</strong> {dish.category?.name}</p>
                                <p className="card-text"><strong>Hozzávalók:</strong> {dish.ingredients}</p>
                                <div className="d-flex justify-content-between align-items-center">
                                    <div className="form-check form-switch">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={dish.is_available}
                                            onChange={() => handleToggleAvailability(dish.id, dish.is_available)}
                                        />
                                        <label className="form-check-label">
                                            {dish.is_available ? 'Elérhető' : 'Nem elérhető'}
                                        </label>
                                    </div>
                                    <button 
                                        className="btn btn-primary btn-sm"
                                        onClick={() => handleEditClick(dish)}
                                    >
                                        Szerkesztés
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit/Create Modal */}
            {showModal && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    {isCreating ? 'Új étel hozzáadása' : 'Étel szerkesztése'}
                                </h5>
                                <button 
                                    type="button" 
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleSubmit} className="mb-4">
                                    <div className="mb-3">
                                        <label className="form-label">Név</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Leírás</label>
                                        <textarea
                                            className="form-control"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Ár (Ft)</label>
                                        <input
                                            type="number"
                                            className="form-control"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Kategória</label>
                                        <select
                                            className="form-control"
                                            name="category_id"
                                            value={formData.category_id}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Válasszon kategóriát</option>
                                            {categories.map(category => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Hozzávalók</label>
                                        <textarea
                                            className="form-control"
                                            name="ingredients"
                                            value={formData.ingredients}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Kép</label>
                                        <input
                                            type="file"
                                            className="form-control"
                                            name="image"
                                            onChange={handleFileChange}
                                            accept="image/*"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                name="is_available"
                                                checked={formData.is_available}
                                                onChange={handleInputChange}
                                            />
                                            <label className="form-check-label">Elérhető</label>
                                        </div>
                                    </div>
                                    <div className="d-flex justify-content-end gap-2">
                                        <button 
                                            type="button" 
                                            className="btn btn-secondary"
                                            onClick={() => setShowModal(false)}
                                        >
                                            Mégse
                                        </button>
                                        <button type="submit" className="btn btn-primary">
                                            {isCreating ? 'Létrehozás' : 'Mentés'}
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