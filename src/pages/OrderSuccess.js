import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa'; // You might need to install react-icons: npm install react-icons

export default function OrderSuccess() {
    const location = useLocation();
    const navigate = useNavigate();
    const { orderId } = location.state || {};

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8 text-center">
                    <div className="card border-success">
                        <div className="card-body py-5">
                            <FaCheckCircle className="text-success mb-4" style={{ fontSize: '5rem' }} />
                            
                            <h1 className="card-title text-success mb-4">Köszönjük a rendelését!</h1>
                            
                            <div className="mb-4">
                                <h4>Rendelési azonosító: #{orderId}</h4>
                                <p className="text-muted">
                                    A rendelés részleteit a "Rendeléseim" menüpont alatt találja.
                                </p>
                            </div>

                            <div className="card mb-4 bg-light">
                                <div className="card-body">
                                    <p className="mb-0">
                                        Az étterem hamarosan visszaigazolja a rendelését.
                                    </p>
                                </div>
                            </div>

                            <button 
                                className="btn btn-primary btn-lg"
                                onClick={() => navigate('/')}
                            >
                                Vissza a főoldalra
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 