import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [cartRestaurant, setCartRestaurant] = useState(null);

    const addToCart = (dish, selectedRestaurant) => {
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

    const emptyCart = () => {
        setCart([]);
        setCartRestaurant(null);
    };

    const calculateTotal = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    return (
        <CartContext.Provider value={{
            cart,
            cartRestaurant,
            addToCart,
            removeFromCart,
            updateQuantity,
            emptyCart,
            calculateTotal
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}; 