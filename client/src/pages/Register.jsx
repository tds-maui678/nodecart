import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api"; // axios instance with baseURL + withCredentials

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passRe = /^(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~]).{8,}$/;
const phoneRe = /^\+?[0-9]{7,15}$/;

export default function Register() {
  const nav = useNavigate();
  const [role, setRole] = useState("customer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");

    // client-side validation
    if (!name.trim()) return setErr("Name is required.");
    if (!emailRe.test(email)) return setErr("Enter a valid email like name@example.com.");
    if (!phoneRe.test(phone)) return setErr("Enter a valid phone number (digits, optional +, 7–15).");
    if (!passRe.test(password)) return setErr("Password must be 8+ chars and include a special character.");

    setLoading(true);
    try {
      const { data } = await api.post("/api/auth/register", {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        password,
        role
      });

      // redirect by role
      const roleFromApi = data?.role || data?.user?.role;
      if (roleFromApi === "seller") nav("/seller", { replace: true });
      else nav("/browse", { replace: true });
    } catch (e) {
      // <- the important part: show the server's message if present
      const msg =
        e?.response?.data?.message ||
        e?.response?.data?.errors?.[0]?.msg ||
        e?.message ||
        "Failed to sign up";
      setErr(msg);
      // optional: also log the full error for debugging
      // console.error("Signup error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-start md:items-center justify-center bg-white py-10">
      <div className="w-full max-w-md border rounded-xl p-6 shadow-sm">
        <Link to="/" className="block mb-6 text-2xl font-bold">NodeCart</Link>

        <h1 className="text-lg font-semibold mb-3">Create account</h1>

        {/* role toggle */}
        <div className="flex items-center gap-3 mb-4">
          <button
            type="button"
            onClick={() => setRole("customer")}
            className={`flex-1 border rounded-full px-4 py-2 text-sm ${role === "customer" ? "bg-black text-white" : ""}`}
          >
            Customer
          </button>
          <button
            type="button"
            onClick={() => setRole("seller")}
            className={`flex-1 border rounded-full px-4 py-2 text-sm ${role === "seller" ? "bg-black text-white" : ""}`}
          >
            Seller
          </button>
        </div>

        {/* error banner */}
        {err && (
          <div className="mb-3 rounded border border-red-300 bg-red-50 text-red-800 text-sm px-3 py-2">
            {err}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border rounded px-3 py-2 outline-none focus:ring-1 focus:ring-black"
          />
          <input
            type="email"
            placeholder="Email (name@example.com)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border rounded px-3 py-2 outline-none focus:ring-1 focus:ring-black"
          />
          <input
            type="tel"
            placeholder="Phone (+15551234567)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border rounded px-3 py-2 outline-none focus:ring-1 focus:ring-black"
          />
          <input
            type="password"
            placeholder="Password (8+ incl. special)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2 outline-none focus:ring-1 focus:ring-black"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white rounded-full py-2 font-semibold disabled:opacity-60"
          >
            {loading ? "Creating..." : "Sign up"}
          </button>
        </form>

        <p className="text-xs text-gray-600 mt-4">
          After sign up, you'll go to your {role === "seller" ? "Seller Dashboard" : "home"}.
        </p>

        <p className="text-sm mt-4">
          Already have an account?{" "}
          <Link to="/login" className="underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}