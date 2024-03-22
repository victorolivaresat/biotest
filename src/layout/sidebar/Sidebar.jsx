import { Offcanvas, Nav, Button } from "react-bootstrap";
import LogoMenu from "../../assets/images/logo.jpg";
import facedetection from "/img/facedetection.svg";
import antispoofing from "/img/antispoofing.png";
import { BsBoxArrowRight } from "react-icons/bs";
import Logo from "../../assets/images/logo.png";
import facesearch from "/img/facesearch.svg";
import { NavLink } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import facecomp from "/img/facecomp.svg";
import PropTypes from "prop-types";
import './Sidebar.css';

const Sidebar = ({ show, handleShow, handleClose }) => {
  const { logoutUser } = useAuth();

  const logout = async () => {
    try {
      await logoutUser();
      handleClose();
    } catch (error) {
      console.error("Error al cerrar sesión: ", error);
    }
  };

  return (
    <div>
      <Offcanvas
        show={show}
        onHide={handleClose}
        scroll={true}
        backdrop={true}
        className="sidebar"
      >
        <Offcanvas.Header closeButton>
          <a
            className="d-flex justify-content-center"
            href="/"
            data-mdb-ripple-color="primary"
          >
            <img
              id="MDB-logo"
              src={Logo}
              alt="ATLogo"
              draggable="false"
              width={150}
            />
          </a>
        </Offcanvas.Header>
        <hr />
        <Offcanvas.Body className="p-1">
          <Nav defaultActiveKey="/home" className="flex-column">
            
            <NavLink
              to="/"
              className="sidebar-link d-flex flex-column align-items-center gap-2 fs-6"
            >
              <img src={facesearch} alt="antispoofing" draggable="false" width={30} />
              <span>Home</span>
            </NavLink>
            
            <NavLink
              to="/liveness"
              className="sidebar-link d-flex flex-column align-items-center gap-2 fs-6"
            >
               <img src={antispoofing} alt="facesearch" draggable="false" width={40} />
              Liveness
            </NavLink>
            
            <NavLink
              to="/face-recognition"
              className="sidebar-link d-flex flex-column align-items-center gap-2 fs-6"
            >
              <img src={facedetection} alt="facesearch" draggable="false" width={50} />
              Face Recognition
            </NavLink>
            
            <NavLink
              to="/face-comparison"
              className="sidebar-link d-flex flex-column align-items-center gap-2 fs-6"
            >
              <img src={facecomp} alt="facesearch" draggable="false" width={70} />
              Face Comparison
            </NavLink>
            
            <Button
              variant="dark"
              onClick={logout}
              className="btn-sm gap-2 my-5 mx-4"
            >
              <BsBoxArrowRight /> Log Out
            </Button>
          </Nav>
        </Offcanvas.Body>
      </Offcanvas>
      
      {!show && (
        <a onClick={handleShow} className="sidebar-btn">
          <img src={LogoMenu} alt="menu" draggable="false" width={30} />
        </a>
      )}
    </div>
  );
};

Sidebar.propTypes = {
  show: PropTypes.bool.isRequired,
  handleShow: PropTypes.func.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default Sidebar;
