import { configureStore } from "@reduxjs/toolkit";
import auth from "./features/authSlice";
import cart from "./features/cartSlice";
import products from "./features/productsSlice";

export default configureStore({
  reducer: { auth, cart, products }
});
