import { createSlice } from "@reduxjs/toolkit";

const saved = JSON.parse(localStorage.getItem("cart") || "[]");
const savedRest = localStorage.getItem("cart_restaurant") || null;

function save(state){
  localStorage.setItem("cart", JSON.stringify(state.items));
  if (state.restaurant) localStorage.setItem("cart_restaurant", state.restaurant);
}

function lineTotal(item){
  const addOnSum = (item.addOns || []).reduce((a,b)=>a + (b.price||0), 0);
  return (item.price + addOnSum) * item.qty;
}

const slice = createSlice({
  name: "cart",
  initialState: { items: saved, restaurant: savedRest },
  reducers: {
    setRestaurant: (s, { payload }) => { s.restaurant = payload; save(s); },
    addToCart: (s, { payload }) => {
      
      if (!s.restaurant) s.restaurant = payload.restaurant || null;
      if (s.restaurant && payload.restaurant && s.restaurant !== payload.restaurant) {
        
        s.items = []; s.restaurant = payload.restaurant;
      }
      const key = JSON.stringify({ id: payload.productId, addOns: payload.addOns?.map(a=>a.name).sort() });
      const i = s.items.find((x) => x._key === key);
      if (i) i.qty += payload.qty || 1;
      else s.items.push({ ...payload, qty: payload.qty || 1, _key: key });
      save(s);
    },
    removeFromCart: (s, { payload: key }) => {
      s.items = s.items.filter((x) => x._key !== key);
      if (s.items.length === 0) s.restaurant = null;
      save(s);
    },
    setQty: (s, { payload: { key, qty } }) => {
      const i = s.items.find((x) => x._key === key);
      if (i) i.qty = qty;
      save(s);
    },
    clearCart: (s) => { s.items = []; s.restaurant = null; save(s); }
  }
});

export const selectors = {
  subtotal: (state) => state.cart.items.reduce((a,b)=> a + lineTotal(b), 0),
  itemsWithTotals: (state) => state.cart.items.map(it => ({...it, lineTotal: lineTotal(it)})),
  restaurant: (state) => state.cart.restaurant
};

export const { addToCart, removeFromCart, setQty, clearCart, setRestaurant } = slice.actions;
export default slice.reducer;
