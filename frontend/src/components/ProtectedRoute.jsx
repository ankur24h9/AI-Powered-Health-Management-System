import { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  // 1. Loading Buffer: Prevents blinking white screens while checking authentication state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-200 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <h2 className="text-sm font-bold text-slate-600 tracking-wide animate-pulse">
          Verifying Security Clearance...
        </h2>
      </div>
    );
  }

  // 2. Gatekeeper: If the user profile isn't logged in, instantly bounce to login screen
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Role Restriction Check: Ensures patients or receptionists can't open doctor tabs
  // Normalized to uppercase to prevent casing string mismatches ("Doctor" vs "DOCTOR")
  if (allowedRoles && !allowedRoles.includes(user.role?.toUpperCase())) {
    return <Navigate to="/login" replace />; 
  }

  // 4. Access Granted: Render the page component normally
  return children;
}

export default ProtectedRoute;