import { useEffect, useState } from "react";
import '../assets/css/transition.css'; 
import PropTypes from "prop-types";

const RouteTransition = ({ children }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(true);
    return () => setShow(false);
  }, []);

  return (
    <div className={`route-fade ${show ? 'route-show' : ''}`}>
      {children}
    </div>
  );
};

RouteTransition.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RouteTransition;
