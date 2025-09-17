import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";

export const fetchMe = createAsyncThunk("auth/me", async () => {
  const { data } = await api.get("/api/auth/me");
  return data.user;
});

export const login = createAsyncThunk("auth/login", async (body) => {
  const { data } = await api.post("/api/auth/login", body);
  return data.user;
});

export const register = createAsyncThunk("auth/register", async (body) => {
  const { data } = await api.post("/api/auth/register", body);
  return data.user;
});

export const logout = createAsyncThunk("auth/logout", async () => {
  await api.post("/api/auth/logout");
});

const slice = createSlice({
  name: "auth",
  initialState: { user: null, status: "idle" },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchMe.fulfilled, (s, a) => { s.user = a.payload; })
     .addCase(login.fulfilled, (s, a) => { s.user = a.payload; })
     .addCase(register.fulfilled, (s, a) => { s.user = a.payload; })
     .addCase(logout.fulfilled, (s) => { s.user = null; });
  }
});

export default slice.reducer;
