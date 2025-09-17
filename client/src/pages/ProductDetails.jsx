import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import AddToCartButton from "/Users/adamibrahim/Desktop/nodecart/client/src/components/AddtoCartButton";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [qty, setQty] = useState(1);
  const [checked, setChecked] = useState({}); // {index: true}

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get(`/api/products/${id}`);
        setProduct(data);
      } catch (e) {
        setErr(e?.response?.data?.message || e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const selectedAddOns = useMemo(() => {
    if (!product?.addOns?.length) return [];
    return product.addOns
      .filter((_, idx) => checked[idx])
      .map(a => ({ name: a.name, price: Number(a.price) || 0 }));
  }, [product, checked]);

  const base = Number(product?.price || 0);
  const addOnSum = selectedAddOns.reduce((s, a) => s + a.price, 0);
  const lineTotal = (base + addOnSum) * qty;

  if (loading) return <div className="p-6">Loading…</div>;
  if (err) return <div className="p-6 text-red-600">{err}</div>;
  if (!product) return null;

  return (
    <div className="max-w-4xl mx-auto p-6 grid md:grid-cols-2 gap-6">
      <div>
        <img
          src={product.images?.[0]?.url || "https://via.placeholder.com/600x400?text=Menu+Item"}
          className="w-full h-72 object-cover rounded"
          alt={product.title}
        />
      </div>

      <div>
        <h1 className="text-2xl font-bold">{product.title}</h1>
        <p className="text-gray-600 mt-1">{product.description}</p>
        <div className="mt-3 text-lg font-semibold">${base.toFixed(2)}</div>

        {/* Add-ons */}
        {product.addOns?.length ? (
          <div className="mt-5">
            <div className="font-semibold mb-2">Add-ons</div>
            <div className="space-y-2">
              {product.addOns.map((a, idx) => (
                <label key={idx} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!!checked[idx]}
                    onChange={(e) => setChecked(prev => ({ ...prev, [idx]: e.target.checked }))}
                  />
                  <span className="flex-1">{a.name}</span>
                  <span className="text-gray-700">+ ${Number(a.price || 0).toFixed(2)}</span>
                </label>
              ))}
            </div>
          </div>
        ) : null}

        {/* Quantity */}
        <div className="mt-5 flex items-center gap-3">
          <label className="text-sm text-gray-700">Qty</label>
          <input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Math.max(1, Number(e.target.value)))}
            className="w-20 border rounded px-2 py-1"
          />
        </div>

        {/* Total + CTA */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-xl font-bold">Total: ${lineTotal.toFixed(2)}</div>
          <AddToCartButton
            product={product}
            qty={qty}
            addOns={selectedAddOns}
            goToCart={false}
          />
        </div>
      </div>
    </div>
  );
}