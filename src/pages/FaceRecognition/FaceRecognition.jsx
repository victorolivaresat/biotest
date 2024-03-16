import { useState, useRef, useEffect } from "react";
import { Row, Col, Button } from "react-bootstrap";
import LoaderPage from "../../utils/LoaderPage";
import { useNavigate } from "react-router-dom";
import { FaCamera } from "react-icons/fa";
import "./FaceRecognition.css";

const FaceRecognition = () => {
  let navigate = useNavigate();
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [loading, setLoading] = useState(false);

  // Go to face comparison
  const goToFaceComaparison = () => {
    navigate("/face-comparison");
  };

  // Verifica si el dispositivo es móvil
  const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  };

  // Effect to get video stream and display it in the <video> element
  useEffect(() => {
    const verified = isMobileDevice();
    console.log(verified);

    const constraints = verified
      ? { video: { facingMode: { exact: "environment" } } }
      : { video: true };

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        videoRef.current.srcObject = stream;
        if (constraints.video.facingMode) {
          videoRef.current.classList.add("mirror");
        }
      })
      .catch((error) => {
        if (error.name === "OverconstrainedError") {
          console.error("Restricciones muy estrictas. Probando alternativas.");
          const alternativeConstraints = { video: { facingMode: "user" } };
          navigator.mediaDevices
            .getUserMedia(alternativeConstraints)
            .then((stream) => {
              videoRef.current.srcObject = stream;
              if (alternativeConstraints.video.facingMode) {
                videoRef.current.classList.remove("mirror");
              }
            })
            .catch((error) => {
              console.error("Error al obtener el flujo de video:", error);
            });
        } else {
          console.error("Error al obtener el flujo de video:", error);
        }
      });
  }, []);

  // Función para capturar y guardar la imagen del video en el localStorage
  const captureAndSaveImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const image = canvas.toDataURL("image/png");
      localStorage.setItem("capturedImage", image);
      setLoading(true);

      setTimeout(() => {
        goToFaceComaparison();
      }, 2000);
    } else {
      console.error("No se puede acceder al video o al canvas");
    }
  };

  // Función para dibujar el contorno del DNI en el canvas
  const drawDNIOutline = () => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    const rectWidth = 562;
    const rectHeight = 374;
    const x = (canvas.width - rectWidth) / 2;
    const y = (canvas.height - rectHeight) / 2;
    const borderRadius = 20;

    // Limpia el canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Dibuja un rectángulo grande para el fondo
    context.fillStyle = "#000000B3";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Establece el modo de composición para 'cortar' el área del DNI
    context.globalCompositeOperation = "destination-out";
    context.beginPath();

    // Dibuja el contorno del DNI
    context.moveTo(x + borderRadius, y);
    context.lineTo(x + rectWidth - borderRadius, y);
    context.arcTo(
      x + rectWidth,
      y,
      x + rectWidth,
      y + borderRadius,
      borderRadius
    );
    context.lineTo(x + rectWidth, y + rectHeight - borderRadius);
    context.arcTo(
      x + rectWidth,
      y + rectHeight,
      x + rectWidth - borderRadius,
      y + rectHeight,
      borderRadius
    );
    context.lineTo(x + borderRadius, y + rectHeight);
    context.arcTo(
      x,
      y + rectHeight,
      x,
      y + rectHeight - borderRadius,
      borderRadius
    );
    context.lineTo(x, y + borderRadius);
    context.arcTo(x, y, x + borderRadius, y, borderRadius);

    context.closePath();
    context.fill();

    // Restaura el modo de composición para futuros dibujos
    context.globalCompositeOperation = "source-over";

    // Dibuja el contorno del DNI
    context.strokeStyle = "#8399DD";
    context.lineWidth = 1.5;
    context.stroke();
  };

  // Efecto para dibujar el contorno del DNI cuando el componente se monta
  useEffect(() => {
    drawDNIOutline();
  }, []);

  return (
    <>
      {loading ? (
        <LoaderPage />
      ) : (
    
          <div className="mt-2">
            <div className="card-doc">
              <div className="ratio ratio-4x3">
                <video
                  ref={videoRef}
                  className="mirror"
                  autoPlay
                  playsInline
                />
                <canvas
                  ref={canvasRef}
                  height={480}
                  width={640}
                  className="position-absolute top-0 start-0"
                />
              </div>
            </div>
            <Button
              onClick={captureAndSaveImage}
              variant="success"
              className="btn-face-recognition rounded-bottom-0 rounded-top-4"
            >
              <FaCamera className="me-2" />
              Capturar y Guardar
            </Button>
          </div>
  
      )}
    </>
  );
};

export default FaceRecognition;
