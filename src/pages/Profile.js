import React, { useState, useEffect } from "react";
import { myAxios } from "../api/axios";
import useAuthContext from "../contexts/AuthContext";

export default function Profile() {
    const { user, getUser } = useAuthContext();
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phone: "",
        address: "",
        password: "",
        password_confirmation: ""
    });
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                username: user.username,
                email: user.email,
                phone: user.phone,
                address: user.address || "",
                password: "",
                password_confirmation: ""
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSuccess(false);

        try {
            await myAxios.put("/api/user/profile", formData);
            setSuccess(true);
            getUser(); // Refresh user data
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
            }
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header">
                            <h3 className="text-center">Profil Szerkesztése</h3>
                        </div>
                        <div className="card-body">
                            {success && (
                                <div className="alert alert-success">
                                    A profil sikeresen frissítve!
                                </div>
                            )}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="username" className="form-label">
                                        Felhasználónév
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="username"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                    />
                                    {errors.username && (
                                        <div className="text-danger">{errors.username[0]}</div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                    {errors.email && (
                                        <div className="text-danger">{errors.email[0]}</div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="phone" className="form-label">
                                        Telefonszám
                                    </label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                    {errors.phone && (
                                        <div className="text-danger">{errors.phone[0]}</div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="address" className="form-label">
                                        Cím
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                    />
                                    {errors.address && (
                                        <div className="text-danger">{errors.address[0]}</div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">
                                        Új jelszó
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                    {errors.password && (
                                        <div className="text-danger">{errors.password[0]}</div>
                                    )}
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="password_confirmation" className="form-label">
                                        Új jelszó megerősítése
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password_confirmation"
                                        name="password_confirmation"
                                        value={formData.password_confirmation}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="d-grid">
                                    <button type="submit" className="btn btn-primary">
                                        Mentés
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 