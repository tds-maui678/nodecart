import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../lib/CartProvider";

export default function CartPage() {
  const { items, updateQty, remove, subtotal } = useCart();
  const nav = useNavigate();

  if (!items.length) {
    return (
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
        <p>Cart is empty. <Link className="underline" to="/browse">Browse restaurants</Link></p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      <div className="space-y-4">
        {items.map((i) => (
          <div key={i.key} className="border rounded p-3 flex gap-3 items-start">
            {i.image ? <img src={i.image} alt="" className="w-16 h-16 object-cover rounded" /> : null}
            <div className="flex-1">
              <div className="font-semibold">{i.title}</div>
              {i.addOns?.length ? (
                <div className="text-sm text-gray-600">
                  Add-ons: {i.addOns.map((a) => `${a.name} (+$${a.price.toFixed(2)})`).join(", ")}
                </div>
              ) : null}
              <div className="flex items-center gap-2 mt-2">
                <input
                  type="number"
                  min={1}
                  value={i.qty}
                  onChange={(e) => updateQty(i.key, Math.max(1, Number(e.target.value)))}
                  className="w-16 border rounded px-2 py-1"
                />
                <button onClick={() => remove(i.key)} className="text-sm underline">Remove</button>
              </div>
            </div>
            <div className="font-semibold">${i.lineTotal.toFixed(2)}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="text-xl font-bold">Subtotal: ${subtotal.toFixed(2)}</div>
        <button
          onClick={() => nav("/checkout")}
          className="bg-black text-white rounded-full px-6 py-2"
        >
          Checkout
        </button>
      </div>
    </div>
  );
}