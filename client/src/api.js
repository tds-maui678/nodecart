import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE || "http://localhost:5000";

// One-time log to verify you're hitting the right host/port
// Remove after confirming.
console.log("[api] baseURL =", baseURL);

const api = axios.create({
  baseURL,
  withCredentials: true, // <-- send/receive cookies
  headers: { "Content-Type": "application/json" },
});

export default api;