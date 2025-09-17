import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import api from "../api";
import { useAuth } from "./AuthProvider";

const Ctx = createContext(null);
const LS_KEY = "nodecart_cart_v2";

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; } catch { return []; }
  });
  const syncing = useRef(false);

  // hydrate from server on login
  useEffect(() => {
    (async () => {
      if (!user) return;
      try {
        const { data } = await api.get("/api/cart");
        setItems(data.items || []);
      } catch (e) {
        console.warn("[cart] hydrate failed", e?.response?.data || e.message);
      }
    })();
  }, [user?.id]);

  // persist locally for guests, and sync to server for logged-in users
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(items));
    if (!user) return;
    (async () => {
      try {
        syncing.current = true;
        await api.put("/api/cart", { items });
      } catch (e) {
        console.warn("[cart] sync failed", e?.response?.data || e.message);
      } finally { syncing.current = false; }
    })();
  }, [items, user?.id]);

  const add = (product, qty = 1, addOns = []) => {
    setItems(prev => {
      if (!product?._id || !product?.restaurant) return prev;
      // one restaurant per cart
      if (prev.length && prev[0].restaurant !== product.restaurant) prev = [];
      const key = `${product._id}|${JSON.stringify(addOns)}`;
      const linePrice = Number(product.price || 0) + addOns.reduce((s,a)=>s+Number(a.price||0),0);
      const found = prev.find(i => i.key === key);
      if (found) {
        return prev.map(i => i.key === key ? { ...i, qty: i.qty + qty, lineTotal: linePrice * (i.qty + qty) } : i);
      }
      return [
        ...prev,
        {
          key,
          productId: product._id,
          restaurant: product.restaurant,
          title: product.title,
          price: Number(product.price || 0),
          image: product.images?.[0]?.url || "",
          addOns,
          qty,
          lineTotal: linePrice * qty,
        },
      ];
    });
  };

  const remove = (key) => setItems(prev => prev.filter(i => i.key !== key));
  const updateQty = (key, qty) => setItems(prev =>
    prev.map(i => i.key === key
      ? { ...i, qty: Math.max(1, Number(qty||1)), lineTotal: (i.price + i.addOns.reduce((s,a)=>s+Number(a.price||0),0)) * Math.max(1, Number(qty||1)) }
      : i
    )
  );
  const clear = () => setItems([]);

  const subtotal = useMemo(() => items.reduce((s, i) => s + Number(i.lineTotal || 0), 0), [items]);

  return (
    <Ctx.Provider value={{ items, add, remove, updateQty, clear, subtotal }}>
      {children}
    </Ctx.Provider>
  );
}
export const useCart = () => useContext(Ctx);