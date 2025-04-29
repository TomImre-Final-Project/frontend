import React, { useState, useEffect } from 'react';
import { myAxios } from '../../api/axios';
import AdminSubNav from './AdminSubNav';

export default function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [editForm, setEditForm] = useState({
        username: '',
        email: '',
        role: '',
        phone: '',
        address: ''
    });

    const fetchUsers = async () => {
        try {
            console.log('Fetching users from /api/admin/users');
            const response = await myAxios.get('/api/admin/users');
            console.log('Users response:', response);
            setUsers(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching users:', err);
            console.error('Error details:', err.response);
            setError(`Failed to fetch users: ${err.message}`);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleEditClick = (user) => {
        setEditingUser(user);
        setEditForm({
            username: user.username,
            email: user.email,
            role: user.role,
            phone: user.phone,
            address: user.address || ''
        });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await myAxios.put(`/api/admin/users/${editingUser.id}`, editForm);
            setEditingUser(null);
            fetchUsers(); // Refresh the list
        } catch (err) {
            setError(`Failed to update user: ${err.message}`);
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
            <h2>Felhasználók Listája</h2>
            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Felhasználónév</th>
                            <th>Email</th>
                            <th>Szerepkör</th>
                            <th>Telefonszám</th>
                            <th>Cím</th>
                            <th>Műveletek</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.username}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td>{user.phone}</td>
                                <td>{user.address}</td>
                                <td>
                                    <button 
                                        className="btn btn-primary btn-sm"
                                        onClick={() => handleEditClick(user)}
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
            {editingUser && (
                <div className="modal show d-block" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Felhasználó szerkesztése</h5>
                                <button 
                                    type="button" 
                                    className="btn-close"
                                    onClick={() => setEditingUser(null)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleEditSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Felhasználónév</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="username"
                                            value={editForm.username}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Email</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            value={editForm.email}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Szerepkör</label>
                                        <select
                                            className="form-control"
                                            name="role"
                                            value={editForm.role}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="admin">Admin</option>
                                            <option value="restaurant_manager">Étterem menedzser</option>
                                            <option value="customer">Vásárló</option>
                                            <option value="courier">Futár</option>
                                        </select>
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
                                        <label className="form-label">Cím</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="address"
                                            value={editForm.address}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="modal-footer">
                                        <button 
                                            type="button" 
                                            className="btn btn-secondary"
                                            onClick={() => setEditingUser(null)}
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