import { Container, Row, Col, Button } from "react-bootstrap";
import { FaExclamationCircle } from "react-icons/fa";
import LoaderPage from "../../utils/LoaderPage";
import { useState, useEffect } from "react";

const NotFound = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      {loading ? (
        <LoaderPage />
      ) : (
        <Container
          fluid
          className="vh-100 d-flex align-items-center justify-content-center"
        >
          <Row className="text-center">
            <Col>
              <h1 className="display-1 fw-bold">404</h1>
              <p className="fs-3">
                <span className="text-danger">
                  <FaExclamationCircle /> Opps!
                </span>{" "}
                Página no encontrada.
              </p>
              <p className="lead">La página que estás buscando no existe.</p>
              <Button href="/" variant="dark" className="rounded-0">
                Ir a Inicio
              </Button>
            </Col>
          </Row>
        </Container>
      )}
    </>
  );
};

export default NotFound;
