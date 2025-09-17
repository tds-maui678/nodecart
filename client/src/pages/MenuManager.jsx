import { useEffect, useState } from "react";
import api from "../api";

export default function MenuManager() {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null); // product being edited
  const [form, setForm] = useState({ title:"", description:"", price:"", category:"" });
  const [err, setErr] = useState("");

  const load = async () => {
    setErr("");
    try {
      // load my restaurant's products
      const { data: myRest } = await api.get("/api/restaurants/mine");
      const { data } = await api.get(`/api/products?restaurant=${myRest._id}`);
      setProducts(data || []);
    } catch (e) {
      setErr(e?.response?.data?.message || e.message);
    }
  };

  useEffect(() => { load(); }, []);

  const startEdit = (p) => {
    setEditing(p);
    setForm({
      title: p.title || "",
      description: p.description || "",
      price: p.price ?? "",
      category: p.category || "",
    });
  };

  const save = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.put(`/api/products/${editing._id}`, {
        ...form,
        price: Number(form.price),
      });
      setEditing(null);
      await load();
      alert(`Updated: ${data.title}`);
    } catch (e) {
      setErr(e?.response?.data?.message || e.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Menu Manager</h1>
      {err && <div className="mb-4 border border-red-300 bg-red-50 text-red-800 px-3 py-2 rounded">{err}</div>}

      {!products.length ? (
        <p>No items yet.</p>
      ) : (
        <div className="space-y-3">
          {products.map(p => (
            <div key={p._id} className="border rounded p-3 flex items-center justify-between">
              <div>
                <div className="font-semibold">{p.title}</div>
                <div className="text-sm text-gray-600">${Number(p.price || 0).toFixed(2)}</div>
              </div>
              <button onClick={() => startEdit(p)} className="px-3 py-1.5 rounded border">
                Edit
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Edit drawer/simple form */}
      {editing && (
        <form onSubmit={save} className="mt-6 border rounded p-4 space-y-3">
          <h2 className="font-semibold">Editing: {editing.title}</h2>
          <input className="w-full border px-3 py-2 rounded" placeholder="Title"
                 value={form.title} onChange={e=>setForm({...form, title:e.target.value})}/>
          <textarea className="w-full border px-3 py-2 rounded" placeholder="Description"
                    value={form.description} onChange={e=>setForm({...form, description:e.target.value})}/>
          <div className="grid grid-cols-2 gap-3">
            <input className="w-full border px-3 py-2 rounded" placeholder="Price"
                   value={form.price} onChange={e=>setForm({...form, price:e.target.value})}/>
            <input className="w-full border px-3 py-2 rounded" placeholder="Category"
                   value={form.category} onChange={e=>setForm({...form, category:e.target.value})}/>
          </div>
          <div className="flex gap-2">
            <button className="bg-black text-white rounded px-4 py-2">Save</button>
            <button type="button" className="rounded px-4 py-2 border" onClick={()=>setEditing(null)}>Cancel</button>
          </div>
        </form>
      )}
    </div>
  );
}