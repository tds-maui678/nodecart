import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api";
import AddToCartButton from "/Users/adamibrahim/Desktop/nodecart/client/src/components/AddtoCartButton";

export default function RestaurantMenu() {
  const { id } = useParams(); // restaurant id
  const [restaurant, setRestaurant] = useState(null);
  const [products, setProducts] = useState([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const r = await api.get(`/api/restaurants/${id}`);
        setRestaurant(r.data);
        const p = await api.get(`/api/products?restaurant=${id}`);
        setProducts(p.data || []);
      } catch (e) {
        setErr(e?.response?.data?.message || e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) return <div className="p-6">Loading…</div>;
  if (err) return <div className="p-6 text-red-600">{err}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{restaurant?.name || "Restaurant"}</h1>
        <p className="text-gray-600">{restaurant?.address}</p>
      </div>

      {!products.length ? (
        <p>No menu items yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((p) => (
            <div key={p._id} className="border rounded p-3 flex flex-col">
              <img
                src={p.images?.[0]?.url || "https://via.placeholder.com/400x300?text=Menu+Item"}
                className="w-full h-40 object-cover rounded mb-3"
                alt={p.title}
              />
              <Link to={`/product/${p._id}`} className="font-semibold hover:underline">
                {p.title}
              </Link>
              <div className="text-gray-600 text-sm line-clamp-2">{p.description}</div>
              <div className="mt-2 font-semibold">${Number(p.price || 0).toFixed(2)}</div>

              <div className="mt-auto pt-3 flex items-center justify-between">
                <Link to={`/product/${p._id}`} className="text-sm underline">
                  Details
                </Link>
                <AddToCartButton product={p} qty={1} addOns={[]} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}