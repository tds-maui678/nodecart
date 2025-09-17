import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cartSlice";

export default function ProductCard({ p }) {
  const d = useDispatch();
  return (
    <div className="bg-white rounded-xl shadow p-3 flex flex-col">
      <img src={p.images?.[0]?.url || "https://via.placeholder.com/400x300"} alt={p.title} className="h-40 object-cover rounded"/>
      <Link to={`/product/${p._id}`} className="mt-2 font-semibold">{p.title}</Link>
      <p className="text-sm text-gray-600 line-clamp-2">{p.description}</p>
      <div className="mt-auto flex items-center justify-between">
        <span className="font-bold">${p.price}</span>
        <button onClick={()=>d(addToCart({productId:p._id,title:p.title,price:p.price,image:p.images?.[0]?.url}))}
                className="px-3 py-1 rounded bg-black text-white">Add</button>
      </div>
    </div>
  );
}
