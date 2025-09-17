import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux"; // or your auth store

export function RequireAuth({ children }) {
  const { user } = useSelector((s) => s.auth || { user: null });
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export function RequireSeller({ children }) {
  const { user } = useSelector((s) => s.auth || { user: null });
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "seller") return <Navigate to="/browse" replace />;
  return children;
}