import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../api";

export const fetchProducts = createAsyncThunk("products/list", async (query = {}) => {
  const params = new URLSearchParams(query).toString();
  const { data } = await api.get(`/api/products${params ? `?${params}` : ""}`);
  return data;
});

export const fetchProduct = createAsyncThunk("products/one", async (id) => {
  const { data } = await api.get(`/api/products/${id}`);
  return data;
});

const slice = createSlice({
  name: "products",
  initialState: { items: [], total: 0, current: null },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchProducts.fulfilled, (s, a) => {
      s.items = a.payload.items; s.total = a.payload.total;
    }).addCase(fetchProduct.fulfilled, (s, a) => { s.current = a.payload; });
  }
});
export default slice.reducer;
