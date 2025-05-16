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
import Orders from "./pages/admin/Orders";
import Statistics from "./pages/admin/Statistics";
import AdminDashboard from "./pages/admin/AdminDashboard";
import useAuthContext from "./contexts/AuthContext";
import Deliverable from "./pages/courier/Deliverable";
import MyDeliveries from "./pages/courier/MyDeliveries";
import CourierDashboard from "./pages/courier/CourierDashboard";
import IncomingOrders from "./pages/restaurantmanager/IncomingOrders";
import MyRestaurant from "./pages/restaurantmanager/MyRestaurant";
import Dishes from "./pages/restaurantmanager/Dishes";
import RestaurantManagerDashboard from "./pages/restaurantmanager/RestaurantManagerDashboard";
import CustomerOrders from "./pages/customer/Orders";


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
                        <Route path="admin/orders" element={<Orders />} />
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
                        <Route path="restaurantmanager" element={<RestaurantManagerDashboard />} />
                        <Route path="restaurantmanager/restaurant" element={<MyRestaurant />} />
                        <Route path="restaurantmanager/dishes" element={<Dishes />} />
                        <Route path="restaurantmanager/orders" element={<IncomingOrders />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="order-details" element={<OrderDetails />} />
                        <Route path="order-success" element={<OrderSuccess />} />
                    </Route>
                )}

                {/* Courier routes */}
                {user && user.role === "courier" && (
                    <Route element={<CourierLayout />}>
                        <Route path="/" element={<KezdolapUser />} />
                        <Route path="courier" element={<CourierDashboard />} />
                        <Route path="courier/deliverable" element={<Deliverable />} />
                        <Route path="courier/my-deliveries" element={<MyDeliveries />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="order-details" element={<OrderDetails />} />
                        <Route path="order-success" element={<OrderSuccess />} />
                    </Route>
                )}

                {/* Customer routes */}
                {user && user.role === "customer" && (
                    <Route element={<UserLayout />}>
                        <Route path="/" element={<KezdolapUser />} />
                        <Route path="orders/*" element={<CustomerOrders />} />
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
