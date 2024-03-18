import { Container, Row, Col, Card, Button } from "react-bootstrap";
import VerifiedGif from "../../assets/images/check.gif";
import ErrorIcon from "../../assets/images/error.png";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Human } from "@vladmandic/human";
import "./FaceComparison.css";

const FaceComparison = () => {
  const [capturedImage, setCapturedImage] = useState(
    localStorage.getItem("capturedImage")
  );
  const [personImage, setPersonImage] = useState(
    localStorage.getItem("personImg")
  );

  const personStatus = localStorage.getItem("personStatus");

  const [human, sethuman] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // Ref for canvas
  const canvasSourceRef = useRef(null);
  const canvasTargetRef = useRef(null);

  let navigate = useNavigate();

  // Compare two images
  const compareImages = async (human) => {
    try {
      if (!human) {
        console.error("Human no está inicializado");
        return;
      }

      let img1 = new Image();
      img1.src = personImage;
      await new Promise((resolve, reject) => {
        img1.onload = resolve;
        img1.onerror = reject;
      });

      let img2 = new Image();
      img2.src = capturedImage;
      await new Promise((resolve, reject) => {
        img2.onload = resolve;
        img2.onerror = reject;
      });

      const firstResult = await human.detect(img1);
      const secondResult = await human.detect(img2);

      const similarity = human.match.similarity(
        firstResult.face[0].embedding,
        secondResult.face[0].embedding
      );

      setResult(100 * similarity);
      setLoading(false);

    } catch (error) {
      setResult(0)
      console.error("Error en la comparación de imágenes:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const humanConfig = {
      face: {
        enabled: true,
        detector: { rotation: true, return: true },
        mesh: { enabled: true },
        description: { enabled: true },
      },
    };

    const human = new Human(humanConfig);

    console.log(personStatus)

    sethuman(human);

    if (personImage && capturedImage && personStatus == "true") {
      setLoading(true);
      compareImages(human);
    }

    return () => {
      human.sleep();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personImage, capturedImage, personStatus]);

  // Go to liveness
  const goToLiveness = () => {
    human.sleep();
    navigate("/liveness");
  };

  // Go to face comparison
  const goToFaceRecognition = () => {
    navigate("/face-recognition");
  };

  // Clear images from localStorage and state
  const clearImages = () => {
    localStorage.removeItem("personStatus");
    localStorage.removeItem("personImg");
    localStorage.removeItem("capturedImage");
    setResult(null);
    setPersonImage(null);
    setCapturedImage(null);
    location.reload();
  };

  return (
    <Container className="pt-2">
      <Row>
        <Col md={2} className="mt-2">
          <Button
            className="clear-img rounded-0 rounded-top-4"
            variant="danger"
            onClick={clearImages}
            size={"sm"}
          >
            Limpiar Imágenes
          </Button>
        </Col>
        <Col md={12}>
          {loading && (
            <div className="counter">
              <span className="loader-comparison"></span>
            </div>
          )}
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col lg={4} className="my-3">
          <h6 className="text-center text-success">Result</h6>
          <Card className="border-0 shadow">
            <Card.Body className="text-center">
              <Card.Text className="text-primary">
                Un puntaje del 66% o más es una coincidencia
              </Card.Text>
              <div className="my-3">
                {result !== null ? (
                  result >= 50 ? (
                    <div>
                      <img src={VerifiedGif} alt="Verified" width={130} />
                      <p className="text-success mt-2">
                        ¡Verificación exitosa!
                      </p>
                    </div>
                  ) : (
                    <div>
                      <img src={ErrorIcon} alt="Error" width={200} />
                      <p className="text-danger mt-2">
                        La verificación no pasó. Repita el procedimiento.
                      </p>
                    </div>
                  )
                ) : (
                  <div>
                    <h1>{result ? result.toFixed(2) + "%" : ""}</h1>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4} className="my-3">
          <h6 className="text-center text-primary">Step 1</h6>
          <Card className="border-0 shadow">
            <Card.Body className="text-center">
              { personStatus == "true" ? (
                <div className="image-container">
                  <img src={personImage} className="img-fluid" />
                  <canvas ref={canvasSourceRef}></canvas>
                </div>
              ) : (
                <div className="py-5 my-5">
                  <p className="mt-5">Upload Image in this space</p>
                  <Button onClick={goToLiveness}>Ir a Liveness (Step 1)</Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4} className="my-3">
          <h6 className="text-center text-primary">Step 2</h6>
          <Card className="border-0 shadow">
            <Card.Body className="text-center">
              {capturedImage ? (
                <div className="image-container">
                  <img src={capturedImage} className="img-fluid" />
                  <canvas ref={canvasTargetRef}></canvas>
                </div>
              ) : (
                <div className="py-5 my-5">
                  <p className="mt-5">Upload Image in this space</p>
                  <Button onClick={goToFaceRecognition}>
                    Ir a FaceRecognition (Step 2)
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default FaceComparison;
