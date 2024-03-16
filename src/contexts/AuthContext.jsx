import { createContext, useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import users from "../assets/user.json";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const usersData = users;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const loginUser = async (email, password) => {
    try {
      const user = usersData.find(
        (user) => user.email === email && user.password === password
      );

      if (user) {
        setCurrentUser(user);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(user));
        toast.success("¡Bienvenido!");
      } else {
        toast.error("Credenciales inválidas. Por favor, inténtalo de nuevo.");
      }
    } catch (error) {
      toast.error("Error al iniciar sesión. Por favor, inténtalo de nuevo.");
    }
  };

  const logoutUser = async () => {
    try {
      localStorage.removeItem("user");
      setCurrentUser(null);
      setIsAuthenticated(false);
      toast.success("¡Hasta pronto!");
    } catch (error) {
      console.error("Error al cerrar sesión: ", error);
      toast.error("Error al cerrar sesión. Por favor, inténtalo de nuevo.");
    }
  };

  const value = {
    currentUser,
    loginUser,
    logoutUser,
    loading,
    isAuthenticated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthContext;
