import { Row, Col, Card, Button, Modal, Ratio } from "react-bootstrap";
import { TbDeviceComputerCamera } from "react-icons/tb";
import VideoDemo from "../../assets/video/bio_sm.mp4";
import { TfiVideoClapper } from "react-icons/tfi";
import LoaderPage from "../../utils/LoaderPage";
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  MdOutlineCheckCircle,
  MdOutlineCameraAlt,
  MdOutlineTimer,
} from "react-icons/md";
import "./Home.css";


const Home = () => {
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const goToLiveness = () => {
    navigate("/liveness");
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timeout);
  }, []);

  const StepCard = ({ step, icon: Icon, title }) => {
    return (
      <Col md={3} className="mt-1">
        <Card className="steps card-relative text-bg-primary bg-opacity-50 shadow">
          <span className="badge-corner">{step}</span>
          <Card.Body>
            <Icon size={50} className="mb-1" aria-label={title} />
            <h6>{title}</h6>
          </Card.Body>
        </Card>
      </Col>
    );
  };

  StepCard.propTypes = {
    step: PropTypes.number.isRequired,
    icon: PropTypes.elementType.isRequired,
    title: PropTypes.string.isRequired,
  };

  return (
    <>
      {loading ? (
        <LoaderPage />
      ) : (
        <Row className="justify-content-center">
        <Col lg={12} md={12} sm={12} xs={12}>
          <div className="text-light bg-primary bg-opacity-10 mt-3 p-4">
            <Col md={12} className="text-center">
              <h4 className="my-3 text-light">
                Prueba de demostración y verificación de identidad
              </h4>
              <p>
                Pasará por un proceso de verificación facial para demostrar
                que es una persona real.
              </p>
            </Col>
            <Row className="text-center justify-content-center">
              <StepCard
                step={1}
                icon={MdOutlineCheckCircle}
                title="Prueba de vida"
              />
              <StepCard
                step={2}
                icon={MdOutlineCameraAlt}
                title="Tómate un selfie."
              />
              <StepCard
                step={3}
                icon={MdOutlineTimer}
                title="Verificar Rostros"
              />
            </Row>
            <Col md={12} className="justify-content-center">
              <Row>
                <Col md={6}>
                  <Card className="my-4 mx-2 fs-6">
                    <Card.Body>
                      <ol  start="1">
                        <li>
                          Cuando vea un óvalo en la pantalla, alinee su rostro dentro
                          del contorno y manténgase quieto hasta que la cámara capture
                          la imagen.
                        </li>
                        <li>Maximice el brillo de la pantalla.</li>
                      </ol>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="my-4 mx-2 fs-6">
                    <Card.Body>
                      <ol start="3">
                        <li>
                          Asegúrese de que su rostro no esté cubierto con gafas de sol
                          o una máscara.
                        </li>
                        <li>
                          Vaya a un lugar bien iluminado que no esté expuesto a la luz
                          solar directa.
                        </li>
                      </ol>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
              <Row className="justify-content-center">
                <Col lg={3} className="d-grid gap-2 mt-3 mb-2 ">
                  <Button
                    variant="light"
                    className="shadow"
                    onClick={handleShowModal}
                  >
                    <TfiVideoClapper size={40} />
                    <div>
                      <span>Video Demo</span>
                    </div>
                  </Button>
                </Col>
                <Col lg={3} className="d-grid gap-2 mt-3 mb-2">
                  <Button
                    variant="success"
                    className="shadow"
                    onClick={goToLiveness}
                  >
                    <TbDeviceComputerCamera size={40} />
                    <div>
                      <span>Comenzar</span>
                    </div>
                  </Button>
                </Col>
              </Row>
            </Col>
          </div>
        </Col>
      </Row>
      )}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton className="px-3 py-1">
          <Modal.Title>
            <span className="text-muted fs-5">Video Demo</span>
          </Modal.Title>
        </Modal.Header>
        <Ratio aspectRatio="1x1">
          <video controls autoPlay>
            <source src={VideoDemo} type="video/mp4" />
            Tu navegador no soporta el elemento de video.
          </video>
        </Ratio>
      </Modal>
    </>
  );
};

export default Home;
