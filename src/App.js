import { Route, Routes } from "react-router-dom";
import Kezdolap from "./pages/Kezdolap";
import Bejelentkezes from "./pages/Bejelentkezes";
import Regisztracio from "./pages/Regisztracio";
import VendegLayout from "./layouts/VendegLayout";
import AdminLayout from "./layouts/AdminLayout";
import KezdolapUser from "./pages/KezdolapUser";
import UserLayout from "./layouts/UserLayout";
import RestaurantManagerLayout from "./layouts/RestaurantManagerLayout";
import CourierLayout from "./layouts/CourierLayout";
import Profile from "./pages/Profile";
import OrderDetails from "./pages/OrderDetails";
import OrderSuccess from "./pages/OrderSuccess";
import Restaurants from "./pages/admin/Restaurants";
import Users from "./pages/admin/Users";
import Statistics from "./pages/admin/Statistics";
import AdminDashboard from "./pages/admin/AdminDashboard";
import useAuthContext from "./contexts/AuthContext";


function App() {
    const { user } = useAuthContext();
    return (
        <>
            <Routes>
                {/* Vendég layout */}
                {!user && (
                    <Route element={<VendegLayout />}>
                        <Route path="/" element={<Kezdolap />} />
                        <Route path="bejelentkezes" element={<Bejelentkezes />} />
                        <Route path="regisztracio" element={<Regisztracio />} />
                    </Route>
                )}

                {/* Admin routes */}
                {user && user.role === "admin" && (
                    <Route element={<AdminLayout />}>
                        <Route path="/" element={<KezdolapUser />} />
                        <Route path="admin" element={<AdminDashboard />} />
                        <Route path="admin/restaurants" element={<Restaurants />} />
                        <Route path="admin/users" element={<Users />} />
                        <Route path="admin/statistics" element={<Statistics />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="order-details" element={<OrderDetails />} />
                        <Route path="order-success" element={<OrderSuccess />} />
                    </Route>
                )}

                {/* Restaurant Manager routes */}
                {user && user.role === "restaurant_manager" && (
                    <Route element={<RestaurantManagerLayout />}>
                        <Route path="/" element={<KezdolapUser />} />
                        <Route path="restaurant" element={<div>My Restaurant</div>} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="order-details" element={<OrderDetails />} />
                        <Route path="order-success" element={<OrderSuccess />} />
                    </Route>
                )}

                {/* Courier routes */}
                {user && user.role === "courier" && (
                    <Route element={<CourierLayout />}>
                        <Route path="/" element={<KezdolapUser />} />
                        <Route path="deliveries" element={<div>Deliveries</div>} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="order-details" element={<OrderDetails />} />
                        <Route path="order-success" element={<OrderSuccess />} />
                    </Route>
                )}

                {/* Customer routes */}
                {user && user.role === "customer" && (
                    <Route element={<UserLayout />}>
                        <Route path="/" element={<KezdolapUser />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="order-details" element={<OrderDetails />} />
                        <Route path="order-success" element={<OrderSuccess />} />
                    </Route>
                )}
            </Routes>
        </>
    );
}

export default App;
