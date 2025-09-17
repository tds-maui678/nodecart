import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import api from "../api";
import { useAuth } from "../lib/AuthProvider";

export default function Login() {
  const nav = useNavigate();
  const { user, setUser } = useAuth();
  const { state } = useLocation(); // optional: location state for "from" redirects
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // If already logged in, go where you belong
  useEffect(() => {
    if (!user) return;
    const role = user.role;
    if (role === "seller") nav("/seller", { replace: true });
    else nav("/browse", { replace: true });
  }, [user, nav]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/login", {
        email: email.trim().toLowerCase(),
        password,
      });

      // Save user (auto-signed-in)
      setUser(data);

      // role-aware redirect
      const role = data?.role || data?.user?.role;
      // (optional) if you had a "from" route, honor it for customers only
      if (role !== "seller" && state?.from) {
        nav(state.from, { replace: true });
      } else if (role === "seller") {
        nav("/seller", { replace: true });
      } else {
        nav("/browse", { replace: true });
      }
    } catch (e) {
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.errors?.[0]?.msg ||
        e?.message ||
        "Sign in failed";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-start md:items-center justify-center bg-white py-10">
      <div className="w-full max-w-md border rounded-xl p-6 shadow-sm">
        <Link to="/" className="block mb-6 text-2xl font-bold">NodeCart</Link>
        <h1 className="text-lg font-semibold mb-3">Sign In</h1>

        {err && (
          <div className="mb-3 rounded border border-red-300 bg-red-50 text-red-800 text-sm px-3 py-2">
            {err}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-3">
          <input
            type="email"
            placeholder="Email (name@example.com)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2 outline-none focus:ring-1 focus:ring-black"
            autoFocus
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2 outline-none focus:ring-1 focus:ring-black"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white rounded-full py-2 font-semibold disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="text-sm mt-4">
          No account? <Link to="/register" className="underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}