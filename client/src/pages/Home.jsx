import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/productsSlice";
import ProductCard from "../components/ProductCard";
import RestaurantCard from "../components/RestaurantCard";
import api from "../api";
import { Link } from "react-router-dom";

export default function Home() {
  const d = useDispatch();
  const { items } = useSelector((s) => s.products);
  const [nearby, setNearby] = useState([]);
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [radius, setRadius] = useState(8000); 
  const [loadingNear, setLoadingNear] = useState(false);

  useEffect(() => { d(fetchProducts()); }, [d]);

  const useMyLocation = () => {
    if (!navigator.geolocation) return alert("Geolocation not supported");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude.toFixed(6));
        setLng(pos.coords.longitude.toFixed(6));
      },
      () => alert("Could not get your location")
    );
  };

  const searchNear = async () => {
    if (!lat || !lng) return alert("Enter coordinates or use My location");
    setLoadingNear(true);
    try {
      const { data } = await api.get("/api/restaurants/near", {
        params: { lat, lng, radius }
      });
      setNearby(data);
    } finally {
      setLoadingNear(false);
    }
  };

  return (
    <>
      {/* HERO */}
      <section className="bg-[#EB1700] text-white">
        <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              $0 delivery fee on first order
            </h1>
            <p className="mt-4 text-white/80 text-lg">
              Enter your address or use your current location to discover restaurants near you.
            </p>

            {/* Address / Location Bar */}
            <div className="mt-6 bg-white rounded-full p-2 flex items-center gap-2">
              <input
                type="text"
                className="flex-1 px-4 py-3 rounded-full text-black outline-none"
                placeholder="Latitude (e.g. 29.7604)"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
              />
              <input
                type="text"
                className="flex-1 px-4 py-3 rounded-full text-black outline-none"
                placeholder="Longitude (e.g. -95.3698)"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
              />
              <button
                onClick={useMyLocation}
                className="px-4 py-3 rounded-full bg-white/20 text-white font-semibold"
              >
                Use my location
              </button>
              <button
                onClick={searchNear}
                className="px-6 py-3 rounded-full bg-black text-white font-semibold"
              >
                Find nearby →
              </button>
            </div>

            <div className="mt-3 flex items-center gap-2 text-sm text-white/80">
              <span>Radius</span>
              <select
                className="bg-white/15 rounded-full px-3 py-1"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
              >
                <option value={3000}>~2 miles</option>
                <option value={8000}>~5 miles</option>
                <option value={16000}>~10 miles</option>
                <option value={32000}>~20 miles</option>
              </select>
            </div>

            <div className="mt-6 flex gap-3">
              <Link to="/register" className="px-5 py-3 rounded-full bg-white text-[#EB1700] font-semibold">
                Sign Up
              </Link>
              <Link to="/login" className="px-5 py-3 rounded-full border border-white/60 font-semibold">
                Sign In for saved address
              </Link>
            </div>
          </div>

          <img
            className="w-full rounded-3xl shadow-2xl"
            src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1600&auto=format&fit=crop"
            alt="Food hero"
          />
        </div>
      </section>

      {/* NEAR YOU */}
      <section className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Restaurants near you</h2>
          <button onClick={searchNear} className="text-sm font-semibold underline">Refresh</button>
        </div>
        {loadingNear ? (
          <div className="p-6 text-center">Finding restaurants…</div>
        ) : nearby.length === 0 ? (
          <div className="text-gray-600">Enter your location above to see nearby places.</div>
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {nearby.map((r) => <RestaurantCard key={r._id} r={r} />)}
          </div>
        )}
      </section>

      {/* PRODUCTS */}
      <section className="max-w-7xl mx-auto px-6 pb-14">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Popular dishes</h2>
          <Link to="/cart" className="text-sm font-semibold underline">View cart</Link>
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {items.map((p) => (
            <ProductCard key={p._id} p={p} />
          ))}
        </div>
      </section>
    </>
  );
}
