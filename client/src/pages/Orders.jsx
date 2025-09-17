import { useEffect, useState } from "react";
import api from "../api";

export default function Orders(){
  const [orders,setOrders]=useState([]);
  useEffect(()=>{ (async()=>{ const {data}=await api.get("/api/orders/mine"); setOrders(data); })(); },[]);
  return (
    <div>
      <h1 className="text-xl font-bold mb-4">My Orders</h1>
      <div className="space-y-3">
        {orders.map(o=>(
          <div key={o._id} className="bg-white rounded p-3">
            <div className="font-semibold">#{o._id.slice(-6)} • ${o.total} • {o.paymentStatus}</div>
            <div className="text-sm text-gray-600">{new Date(o.createdAt).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
