import { AuthProvider } from "../contexts/AuthContext";
import { useLocation } from "react-router-dom";
import { Container } from "react-bootstrap";
import AppRoutes from "../routes/Routes";
import Sidebar from "./sidebar/Sidebar";
import { useState } from "react";

const Layout = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const location = useLocation();

  return (
    <AuthProvider>
      <Container fluid>
        {location.pathname !== "/login" && (
          <Sidebar
            show={show}
            handleShow={handleShow}
            handleClose={handleClose}
          />
        )}
        <AppRoutes />
      </Container>
    </AuthProvider>
  );
};

export default Layout;