import { useEffect, useState } from "react";
import api from "../api";
import useCloudinaryUpload from "../lib/useCloudinaryUpload";

export default function SellerDashboard() {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [form, setForm] = useState({ name: "", description: "", address: "", lat: "", lng: "" });
  const [menuForm, setMenuForm] = useState({ title: "", description: "", price: "", category: "" });
  const [addOns, setAddOns] = useState([]);
  const [images, setImages] = useState([]);
  const { upload } = useCloudinaryUpload("nodecart/menu");

  useEffect(() => {
    (async () => {
      try { const { data } = await api.get("/api/restaurants/mine"); setRestaurant(data); }
      catch (e) { setErr(e?.response?.data?.message || e.message); }
      finally { setLoading(false); }
    })();
  }, []);

  const createRestaurant = async (e) => {
    e.preventDefault(); setErr("");
    try {
      const { data } = await api.post("/api/restaurants", {
        ...form,
        lat: form.lat ? Number(form.lat) : undefined,
        lng: form.lng ? Number(form.lng) : undefined,
        image: images[0]?.url || "",
      });
      setRestaurant(data);
    } catch (e) { setErr(e?.response?.data?.message || e.message); }
  };

  const onImagePick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const img = await upload(file);
      setImages((prev) => [...prev, img]);
    } catch (e) {
      setErr(e.message);
    }
  };

  const addAddOn = () => setAddOns((prev) => [...prev, { name: "", price: 0 }]);
  const updateAddOn = (idx, key, val) => setAddOns((prev) => prev.map((a, i) => i === idx ? { ...a, [key]: key==='price'? Number(val) : val } : a));
  const removeAddOn = (idx) => setAddOns((prev) => prev.filter((_, i) => i !== idx));

  const createMenuItem = async (e) => {
    e.preventDefault(); setErr("");
    try {
      const payload = {
        title: menuForm.title,
        description: menuForm.description,
        price: Number(menuForm.price),
        category: menuForm.category,
        images,
        addOns: addOns.filter(a => a.name && a.price >= 0),
      };
      const { data } = await api.post("/api/products", payload);
      setMenuForm({ title: "", description: "", price: "", category: "" });
      setAddOns([]); setImages([]);
      alert(`Menu item created: ${data.title}`);
    } catch (e) {
      setErr(e?.response?.data?.message || e.message);
    }
  };

  if (loading) return <div className="p-6">Loading…</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">Seller Dashboard</h1>
      {err && <div className="mb-3 border border-red-300 bg-red-50 text-red-800 px-3 py-2 rounded">{err}</div>}

      {!restaurant ? (
        <form onSubmit={createRestaurant} className="space-y-3 border p-4 rounded">
          <h2 className="font-semibold">Create your restaurant</h2>
          <input className="w-full border px-3 py-2 rounded" placeholder="Name"
                 value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})}/>
          <input className="w-full border px-3 py-2 rounded" placeholder="Address"
                 value={form.address} onChange={(e)=>setForm({...form, address:e.target.value})}/>
          <textarea className="w-full border px-3 py-2 rounded" placeholder="Description"
                 value={form.description} onChange={(e)=>setForm({...form, description:e.target.value})}/>
          <div className="grid grid-cols-2 gap-3">
            <input className="w-full border px-3 py-2 rounded" placeholder="Lat (optional)"
                   value={form.lat} onChange={(e)=>setForm({...form, lat:e.target.value})}/>
            <input className="w-full border px-3 py-2 rounded" placeholder="Lng (optional)"
                   value={form.lng} onChange={(e)=>setForm({...form, lng:e.target.value})}/>
          </div>
          {/* restaurant image */}
          <div>
            <label className="block text-sm mb-1">Restaurant image</label>
            <input type="file" accept="image/*" onChange={onImagePick}/>
            <div className="flex gap-2 mt-2">
              {images.map((img) => <img key={img.publicId} src={img.url} className="w-16 h-16 object-cover rounded" />)}
            </div>
          </div>
          <button className="bg-black text-white rounded px-4 py-2">Create</button>
        </form>
      ) : (
        <div className="border rounded p-4">
          <h2 className="text-xl font-semibold">{restaurant.name}</h2>
          {restaurant.image && <img src={restaurant.image} className="w-24 h-24 object-cover rounded mt-2" />}
          <p className="text-gray-600">{restaurant.address}</p>
          <p className="mt-2">{restaurant.description}</p>
        </div>
      )}

      {/* Menu builder */}
      <form onSubmit={createMenuItem} className="space-y-3 border p-4 rounded">
        <h2 className="font-semibold">Add Menu Item</h2>
        <input className="w-full border px-3 py-2 rounded" placeholder="Title"
               value={menuForm.title} onChange={(e)=>setMenuForm({...menuForm, title:e.target.value})}/>
        <textarea className="w-full border px-3 py-2 rounded" placeholder="Description"
               value={menuForm.description} onChange={(e)=>setMenuForm({...menuForm, description:e.target.value})}/>
        <div className="grid grid-cols-2 gap-3">
          <input className="w-full border px-3 py-2 rounded" placeholder="Price"
                 value={menuForm.price} onChange={(e)=>setMenuForm({...menuForm, price:e.target.value})}/>
          <input className="w-full border px-3 py-2 rounded" placeholder="Category"
                 value={menuForm.category} onChange={(e)=>setMenuForm({...menuForm, category:e.target.value})}/>
        </div>

        {/* images */}
        <div>
          <label className="block text-sm mb-1">Item images</label>
          <input type="file" accept="image/*" onChange={onImagePick}/>
          <div className="flex gap-2 mt-2">
            {images.map((img) => <img key={img.publicId} src={img.url} className="w-16 h-16 object-cover rounded" />)}
          </div>
        </div>

        {/* add-ons */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="font-medium">Add-ons</div>
            <button type="button" onClick={addAddOn} className="underline">Add add-on</button>
          </div>
          {addOns.map((a, idx) => (
            <div key={idx} className="grid grid-cols-5 gap-2">
              <input className="col-span-3 border px-3 py-2 rounded" placeholder="Name"
                     value={a.name} onChange={(e)=>updateAddOn(idx,"name",e.target.value)}/>
              <input className="col-span-1 border px-3 py-2 rounded" placeholder="Price"
                     value={a.price} onChange={(e)=>updateAddOn(idx,"price",e.target.value)}/>
              <button type="button" onClick={()=>removeAddOn(idx)} className="underline">Remove</button>
            </div>
          ))}
        </div>

        <button className="bg-black text-white rounded px-4 py-2">Create item</button>
      </form>
    </div>
  );
}