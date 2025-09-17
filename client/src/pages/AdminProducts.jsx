import { useEffect, useState } from "react";
import api from "../api";

export default function AdminProducts(){
  const [items,setItems]=useState([]);
  const [form,setForm]=useState({ title:"", price:0, description:"", imageFile:null });

  const load=async()=>{ const {data}=await api.get("/api/products?limit=100"); setItems(data.items); };
  useEffect(()=>{ load(); },[]);

  const toBase64 = (file)=> new Promise((res,rej)=>{ const r=new FileReader(); r.onload=()=>res(r.result); r.onerror=rej; r.readAsDataURL(file); });

  const create = async (e) => {
    e.preventDefault();
    let img=null;
    if(form.imageFile){
      const b64 = await toBase64(form.imageFile);
      const { data } = await api.post("/api/upload", { image: b64 });
      img = { url: data.url, publicId: data.publicId };
    }
    await api.post("/api/products", { title:form.title, price:+form.price, description:form.description, images: img?[img]:[] });
    setForm({ title:"", price:0, description:"", imageFile:null });
    await load();
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <form onSubmit={create} className="space-y-2 bg-white p-4 rounded">
        <h2 className="font-semibold">Create Product</h2>
        <input className="w-full border p-2 rounded" placeholder="Title"
               value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/>
        <input type="number" className="w-full border p-2 rounded" placeholder="Price"
               value={form.price} onChange={e=>setForm({...form,price:e.target.value})}/>
        <textarea className="w-full border p-2 rounded" placeholder="Description"
               value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/>
        <input type="file" onChange={e=>setForm({...form,imageFile:e.target.files[0]})}/>
        <button className="px-4 py-2 bg-black text-white rounded">Save</button>
      </form>

      <div className="space-y-3">
        <h2 className="font-semibold">Products</h2>
        {items.map(p=>(
          <div key={p._id} className="bg-white p-3 rounded flex items-center gap-3">
            <img src={p.images?.[0]?.url} className="w-16 h-16 object-cover rounded"/>
            <div className="flex-1">
              <div className="font-semibold">{p.title}</div>
              <div>${p.price}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
