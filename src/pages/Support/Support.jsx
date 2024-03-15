import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";
import upload from "/img/icons/upload.svg";
import { useState, useRef } from "react";
import "./Support.css";

function Support() {
  const [doiImage, setDoiImage] = useState(null);
  const [personImage, setPersonImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const personImageInputRef = useRef(null);
  const doiImageInputRef = useRef(null);
  const [similarity, setSimilarity] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [firstImageDetails, setFirstImageDetails] = useState({
    age: null,
    gender: null,
  });
  const [secondImageDetails, setSecondImageDetails] = useState({
    age: null,
    gender: null,
  });

  const handleImageUploadClick = (inputRef) => {
    inputRef.current.click();
  };

  const handleImageChange = (e, setImage) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Compare two images
  const compareImages = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    console.log("Intentando comparar imágenes");
    console.log("Comparación de imágenes exitosa:");
    setIsLoading(false);
  };

  // Clear images
  const clearImages = () => {
    // Resetear los estados de las imágenes
    setPersonImage(null);
    setDoiImage(null);

    // Resetear los estados de los resultados de la comparación y el mensaje de error
    setErrorMessage(null);
    setSimilarity(null);
    setFirstImageDetails({ age: null, gender: null });
    setSecondImageDetails({ age: null, gender: null });
  };


  return (
    <Container>
      <Row>
        <Col>
          <h4 className="text-center text-success mt-2">
            Face Comparison Demo
          </h4>
          <p className="text-center">
            Face Comparison allows you to tell if two facial images belong to
            the same person...
          </p>
        </Col>
      </Row>
      <Row className="my-4">
        <Col md={4} className="my-2">
          <Card className="text-center shadow">
            <Card.Body>
              <input
                type="file"
                onChange={(e) => handleImageChange(e, setPersonImage)}
                hidden
                ref={personImageInputRef}
              />
              {personImage ? (
                <img src={personImage} alt="Person" className="img-fluid" />
              ) : (
                <div className="text-center">
                  <img
                    src={upload}
                    alt="Person"
                    className="img-fluid upload-img"
                    width={120}
                    onClick={() => handleImageUploadClick(personImageInputRef)}
                  />
                  <p className="mt-3">
                    Upload Image or drag and drop in this space
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="my-2">
          <Card className="text-center shadow">
            <Card.Body>
              <input
                type="file"
                onChange={(e) => handleImageChange(e, setDoiImage)}
                hidden
                ref={doiImageInputRef}
              />
              {doiImage ? (
                <img src={doiImage} alt="Captured" className="img-fluid" />
              ) : (
                <div className="text-center">
                  <img
                    src={upload}
                    alt="doi"
                    className="img-fluid upload-img"
                    width={120}
                    onClick={() => handleImageUploadClick(doiImageInputRef)}
                  />
                  <p className="mt-3">
                    Upload Image or drag and drop in this space
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="my-2">
          {isLoading ? (
            <div className="text-center my-4">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <Card className="shadow">
              <Card.Body>
                <h5 className="text-center">Results</h5>
                {similarity !== null ? (
                  <div className="text-center">
                    <h5 className="text-success">Similarity</h5>
                    <p className="text-similarity">
                      {(similarity * 100).toFixed(2)}%
                    </p>
                  </div>
                ) : (
                  <div className="text-center text-secondary">
                    <p className="text-secondary">
                      Score of 66% or more is a match
                    </p>
                    <p className="text-similarity">...</p>
                  </div>
                )}

                {firstImageDetails.age && secondImageDetails.age && (
                  <Row>
                    <Col md={6}>
                      <Card className="shadow-sm">
                        <Card.Body>
                          <div className="text-center">
                            {secondImageDetails.age && (
                              <>
                                <h5 className="text-primary">Picture 1</h5>
                                <p className="text-primary-emphasis">
                                  Age: {secondImageDetails.age.low} -{" "}
                                  {secondImageDetails.age.high}
                                </p>
                              </>
                            )}
                            {secondImageDetails.gender && (
                              <p className="text-primary-emphasis">
                                Gender: {secondImageDetails.gender.value}
                              </p>
                            )}
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col md={6}>
                      <Card className="shadow-sm">
                        <Card.Body>
                          <div className="text-center">
                            {firstImageDetails.age && (
                              <>
                                <h5 className="text-primary">Picture 2</h5>
                                <p className="text-primary-emphasis">
                                  Age: {firstImageDetails.age.low} -{" "}
                                  {firstImageDetails.age.high}
                                </p>
                              </>
                            )}
                            {firstImageDetails.gender && (
                              <p className="text-primary-emphasis">
                                Gender: {firstImageDetails.gender.value}
                              </p>
                            )}
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                )}
                {errorMessage && (
                  <p className="text-center text-danger">{errorMessage}</p>
                )}
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
      <Row>
        <Col className="d-flex justify-content-center mb-3">
          <Button className="m-1" variant="primary" onClick={compareImages}>
            Compare
          </Button>
          <Button className="m-1" variant="secondary" onClick={clearImages}>
            Clear Img
          </Button>
        </Col>
      </Row>
    </Container>
  );
}

export default Support;
