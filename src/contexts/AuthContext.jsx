import { createContext, useState, useEffect } from "react";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Datos estáticos para fines de prueba
  const mockUserData = {
    email: "prevencion@apuestatotal.com",
    password: "password",
    firstName: "Prevencion",
    lastName: "De Fraude",
  };

  const loginUser = async (email, password) => {
    try {
      // Simulación de inicio de sesión con datos estáticos
      if (email === mockUserData.email && password === mockUserData.password) {
        setCurrentUser(mockUserData);
        setIsAuthenticated(true);
        toast.success("¡Bienvenido de nuevo!");
      } else {
        toast.error("Credenciales inválidas. Por favor, inténtalo de nuevo.");
      }
    } catch (error) {
      toast.error("Error al iniciar sesión. Por favor, inténtalo de nuevo.");
      console.error("Error durante el inicio de sesión", error);
    }
  };

  const logoutUser = async () => {
    try {
      setCurrentUser(null);
      setIsAuthenticated(false);
      toast.success("¡Hasta pronto!");
    } catch (error) {
      console.error("Error al cerrar sesión: ", error);
      toast.error("Error al cerrar sesión. Por favor, inténtalo de nuevo.");
    }
  };

  useEffect(() => {
    setIsAuthenticated(!!currentUser);
    setLoading(false);
  }, [currentUser]);

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
