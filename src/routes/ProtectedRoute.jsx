import useAuth from "../hooks/useAuth";
import { Navigate, Outlet } from "react-router-dom";
import "./routes.css"

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  return (
    <>
      { loading ? (
        <div className="loading">
          Loading...
        </div>
      ) : (
        <>{isAuthenticated ? <Outlet /> : <Navigate to="/login" />}</>
      )}
    </>
  );
};

export default ProtectedRoute;
