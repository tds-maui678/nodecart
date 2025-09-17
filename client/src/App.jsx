import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

// Public pages
import Home from "./pages/Home";
import BrowseRestaurants from "./pages/BrowseRestaurants";
import RestaurantMenu from "./pages/RestaurantMenu";
import ProductDetails from "./pages/ProductDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Cart / Orders / Checkout
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Orders from "./pages/Orders";

// Admin + Seller
import AdminProducts from "./pages/AdminProducts";
import SellerDashboard from "./pages/SellerDashboard";
import RestaurantForm from "./pages/RestaurantForm";
import MenuManager from "./pages/MenuManager";

// Your existing guard
import ProtectedRoute from "./components/ProtectedRoute";

// (Optional) simple 404 component
function NotFound() {
  return (
    <div className="py-16 text-center">
      <h1 className="text-2xl font-bold mb-2">404</h1>
      <p className="text-gray-600">That page does not exist.</p>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* page container */}
      <div className="max-w-7xl mx-auto p-6">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/browse" element={<BrowseRestaurants />} />
          <Route path="/r/:id" element={<RestaurantMenu />} />
          <Route path="/product/:id" element={<ProductDetails />} />

          {/* Cart / Checkout / Orders */}
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />

          {/* Admin (example) */}
          <Route
            path="/admin/products"
            element={
              <ProtectedRoute admin>
                <AdminProducts />
              </ProtectedRoute>
            }
          />

          {/* Seller-only */}
          <Route
            path="/seller"
            element={
              <ProtectedRoute role="seller">
                <SellerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/restaurant"
            element={
              <ProtectedRoute role="seller">
                <RestaurantForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/seller/menu"
            element={
              <ProtectedRoute role="seller">
                <MenuManager />
              </ProtectedRoute>
            }
          />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}