import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../api";
import { useAuth } from "../lib/AuthProvider";
import { useCart } from "../lib/CartProvider";

export default function Navbar() {
  const { user, setUser } = useAuth();
  const { items } = useCart();
  const nav = useNavigate();
  const { pathname } = useLocation();

  const cartCount = items.reduce((s, i) => s + i.qty, 0);

  const logout = async () => {
    try {
      await api.post("/api/auth/logout");
    } catch {}
    setUser(null);
    nav("/login", { replace: true });
  };

  const linkCls = (p) =>
    `px-3 py-2 rounded ${pathname === p ? "bg-black text-white" : "hover:bg-gray-200"}`;

  return (
    <header className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link to="/" className="text-xl font-extrabold">NodeCart</Link>
          <nav className="hidden sm:flex items-center gap-1">
            <Link to="/browse" className={linkCls("/browse")}>Browse</Link>

            {/* Show Seller Dashboard link only for sellers */}
            {user?.role === "seller" && (
              <Link to="/seller" className={linkCls("/seller")}>Dashboard</Link>
            )}

            {/* Everyone can see orders if logged in */}
            {user && (
              <Link to="/orders" className={linkCls("/orders")}>Orders</Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {/* Cart button w/ live count */}
          <Link
            to="/cart"
            className="inline-flex items-center gap-2 border rounded-full px-3 py-1.5 hover:bg-gray-50"
            aria-label="Cart"
          >
            <span>Cart</span>
            <span className="min-w-6 h-6 inline-flex items-center justify-center text-sm font-semibold bg-black text-white rounded-full px-2">
              {cartCount}
            </span>
          </Link>

          {!user ? (
            <>
              <Link to="/login" className="px-3 py-1.5 rounded hover:bg-gray-100">Sign in</Link>
              <Link to="/register" className="px-3 py-1.5 rounded bg-black text-white">Sign up</Link>
            </>
          ) : (
            <button onClick={logout} className="px-3 py-1.5 rounded border hover:bg-gray-50">
              Logout
            </button>
          )}
        </div>
      </div>

      {/* mobile secondary nav */}
      <div className="sm:hidden border-t">
        <nav className="max-w-7xl mx-auto px-4 md:px-6 py-2 flex gap-2">
          <Link to="/browse" className={linkCls("/browse")}>Browse</Link>
          {user?.role === "seller" && (
            <Link to="/seller" className={linkCls("/seller")}>Dashboard</Link>
          )}
          {user && (
            <Link to="/orders" className={linkCls("/orders")}>Orders</Link>
          )}
        </nav>
      </div>
    </header>
  );
}