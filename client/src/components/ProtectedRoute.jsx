import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../lib/AuthProvider";

export default function ProtectedRoute({ children, admin, role }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // remember where they were trying to go (e.g. /checkout)
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (admin && user.role !== "admin") return <Navigate to="/browse" replace />;
  if (role && user.role !== role) return <Navigate to="/browse" replace />;
  return children;
}