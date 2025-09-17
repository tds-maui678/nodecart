import { useEffect, useState } from "react";
import api from "../api";
import RestaurantCard from "../components/RestaurantCard";
import { Link } from "react-router-dom";

export default function BrowseRestaurants(){
  const [nearby, setNearby] = useState([]);
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [radius, setRadius] = useState(8000);
  const [loading, setLoading] = useState(false);

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
    if (!lat || !lng) return;
    setLoading(true);
    try {
      const { data } = await api.get("/api/restaurants/near", { params: { lat, lng, radius } });
      setNearby(data);
    } finally { setLoading(false); }
  };

  useEffect(()=>{ useMyLocation(); },[]);
  useEffect(()=>{ if(lat && lng) searchNear(); /* auto search */ },[lat,lng]);

  return (
    <div>
      <div className="rounded-2xl bg-white p-4 shadow flex flex-wrap items-center gap-2 mb-6">
        <input className="border rounded-full px-4 py-2" placeholder="Latitude"
               value={lat} onChange={(e)=>setLat(e.target.value)} />
        <input className="border rounded-full px-4 py-2" placeholder="Longitude"
               value={lng} onChange={(e)=>setLng(e.target.value)} />
        <select className="border rounded-full px-3 py-2" value={radius} onChange={(e)=>setRadius(Number(e.target.value))}>
          <option value={3000}>~2mi</option><option value={8000}>~5mi</option>
          <option value={16000}>~10mi</option><option value={32000}>~20mi</option>
        </select>
        <button onClick={searchNear} className="px-4 py-2 bg-black text-white rounded-full">Search</button>
      </div>

      {loading ? <div>Loading…</div> : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {nearby.map(r => (
            <Link key={r._id} to={`/r/${r._id}`}><RestaurantCard r={r} /></Link>
          ))}
        </div>
      )}
    </div>
  );
}
