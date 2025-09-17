import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

export default function RestaurantForm() {
  const [form, setForm] = useState({ name: "", description: "", address: "" });
  const nav = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/api/restaurants", form);
    nav("/seller");
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl shadow">
      <h1 className="text-2xl font-bold mb-4">Create Restaurant</h1>
      <form onSubmit={submit} className="space-y-3">
        <input className="w-full border p-3 rounded-xl" placeholder="Restaurant name"
               value={form.name} onChange={(e)=>setForm({...form, name:e.target.value})}/>
        <textarea className="w-full border p-3 rounded-xl" placeholder="Description"
               value={form.description} onChange={(e)=>setForm({...form, description:e.target.value})}/>
        <input className="w-full border p-3 rounded-xl" placeholder="Address"
               value={form.address} onChange={(e)=>setForm({...form, address:e.target.value})}/>
        <button className="w-full bg-black text-white rounded-xl p-3 font-semibold">Save</button>
      </form>
    </div>
  );
}
