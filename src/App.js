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
                        <Route path="/" element={<Kezdolap />} />
                        <Route path="admin" element={<div>Admin Panel</div>} />
                    </Route>
                )}

                {/* Restaurant Manager routes */}
                {user && user.role === "restaurant_manager" && (
                    <Route element={<RestaurantManagerLayout />}>
                        <Route path="/" element={<div>Restaurant Manager Panel</div>} />
                        <Route path="restaurant" element={<div>My Restaurant</div>} />
                    </Route>
                )}

                {/* Courier routes */}
                {user && user.role === "courier" && (
                    <Route element={<CourierLayout />}>
                        <Route path="/" element={<div>Courier Panel</div>} />
                        <Route path="deliveries" element={<div>Deliveries</div>} />
                    </Route>
                )}

                {/* Customer routes */}
                {user && user.role === "customer" && (
                    <Route element={<UserLayout />}>
                        <Route path="/" element={<KezdolapUser />} />
                    </Route>
                )}
            </Routes>
        </>
    );
}

export default App;
