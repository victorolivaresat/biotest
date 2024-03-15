import { useState } from "react";
import Tesseract from "tesseract.js";
import { Container, Row, Col, Button, Image, Alert } from "react-bootstrap";
import { MdOutlineFileUpload } from "react-icons/md";

const Ocr = () => {
  const [text, setText] = useState(null);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (event) => {
    if (event.target.files[0]) {
      setImage(URL.createObjectURL(event.target.files[0]));
      setText(null);
      setError(null);
    }
  };

  const handleClick = () => {
    setLoading(true);
    Tesseract.recognize(image, "spa", {
      logger: (m) => console.log(m),
    })
      .then(({ data: { text } }) => {
        setText(text);
        setLoading(false);
      })
      .catch((error) => {
        setError(error);
        setLoading(false);
        console.error(error);
      });
  };

  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={8} className="my-3">
          {image && <Image src={image} alt="Imagen para OCR" fluid />}
        </Col>
        <Col md={4} className="my-3">
          <div className="d-grid gap-2 mb-3">
            <label htmlFor="fileUpload" className="btn btn-primary">
              <MdOutlineFileUpload /> Cargar Imagen
            </label>
            <input id="fileUpload" type="file" onChange={handleChange} hidden />
          </div>
          <div className="d-grid gap-2">
            <Button variant="success" onClick={handleClick} disabled={loading}>
              {loading ? "Procesando..." : "Leer Texto"}
            </Button>
          </div>
          {error && (
            <Alert variant="danger" className="my-3">Error al procesar la imagen.</Alert>
          )}
          {text && <p className="fs-5 mt-3">Texto Reconocido: {text}</p>}
        </Col>
      </Row>
    </Container>
  );
};

export default Ocr;
