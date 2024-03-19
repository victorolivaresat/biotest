import { FaPlay, FaStop, FaTimes } from "react-icons/fa";
import { Transition } from "react-transition-group";
import { useState, useEffect, useRef } from "react";
import { Button, Container } from "react-bootstrap";
import LoaderPage from "../../utils/LoaderPage";
import { useNavigate } from "react-router-dom";
import { MdFlip } from "react-icons/md";
import Human from "@vladmandic/human";
import "./Liveness.css";

const Liveness = () => {
  /* State variables */
  /* ---------------------------------- */

  // Human.js instance
  let msg = "Active la cámara para iniciar el proceso de validación";
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [human, setHuman] = useState(null);
  const [counter, setCounter] = useState(5);

  // Webcam state
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [isMirrored, setIsMirrored] = useState(true);

  // Process state
  const [processCompleted, setProcessCompleted] = useState(false);
  const distanceValidated = false;

  // Message and button state
  const [message, setMessage] = useState(msg);
  const [validationMessage, setValidationMessage] = useState(null);
  const [showButton, setShowButton] = useState(false);

  // Validation step
  const [distance, setDistance] = useState(0);
  const [validationStep, setValidationStep] = useState(0);
  const [isCentered, setIsCentered] = useState(false);

  // useRef for the video and canvas elements
  const validationStepRef = useRef(validationStep);
  const distanceValidatedRef = useRef(false);
  const isCenteredRef = useRef(false);
  const counterRef = useRef(counter);
  const canvasRef = useRef(null);
  const nodeRef = useRef(null);
  const videoRef = useRef(null);
  const inputRef = useRef(null);

  // Navigate to another page
  const navigate = useNavigate();

  // Transition duration in milliseconds
  const duration = 500;

  // Minimum and maximum distance from the camera
  const minDistance = 0.2;
  const maxDistance = 0.4;
  const maxInputRange = 0.7;

  // Data to be validated
  const [ok, setOk] = useState({
    // Face detection
    faceSize: { status: false, val: [], text: "Face size" },
    faceCount: { status: false, val: [], text: "Face count" },
    faceConfidence: { status: false, val: [], text: "Face confidence" },
    // Gestures
    gestures: { val: [], text: "Gestures" },
    facingCenter: { status: false, text: "Facing center" },
    lookingCenter: { status: false, text: "Looking center" },
    blinkDetected: { status: false, val: [], text: "Blink detected" },
    // Liveness detection
    antispoof: { status: false, val: [], text: "Antispoof" },
    liveness: { status: false, val: [], text: "Liveness" },
    distance: { status: false, val: [], text: "Distance" },
    object: { status: false, val: [], text: "Object" },
    gender: { status: false, val: [], text: "Gender" },
    age: { status: false, val: [], text: "Age" },
  });

  // Human.js options
  const options = {
    minConfidence: 0.6,
    maxTime: 20000,
    distanceMin: minDistance,
    distanceMax: maxDistance,
  };

  //  Transition styles
  const defaultStyle = {
    transition: `opacity ${duration}ms ease-in-out`,
    opacity: 0,
  };

  // Transition styles for each state
  const transitionStyles = {
    entering: { opacity: 0 },
    entered: { opacity: 1 },
    exiting: { opacity: 1 },
    exited: { opacity: 0 },
  };

  // Check if the device is a mobile device
  const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  };

  /* Functions */

  // Url models
  const nanodet = "models/nanodet.json";

  // Human.js config object for face detection
  useEffect(() => {
    const humanConfig = {
      debug: true,
      backend: "webgl",
      cacheSensitivity: 0,
      modelBasePath: "https://cdn.jsdelivr.net/gh/vladmandic/human-models",
      face: {
        enabled: true,
        detector: {
          maxDetected: 1,
        },
        emotion: { enabled: true },
        age: { enabled: true },
        gender: { enabled: true },
        liveness: { enabled: true },
        gesture: { enabled: true },
        antispoof: { enabled: true },
        iris: { enabled: true },
      },
      object: {
        enabled: true,
        modelPath: nanodet,
      },
      body: { enabled: false },
      hand: { enabled: false },
    };

    const humanInstance = new Human(humanConfig);
    humanInstance.load();
    setHuman(humanInstance);

    return () => {
      humanInstance.sleep();
    };
  }, []);

  // Update validation step
  useEffect(() => {
    validationStepRef.current = validationStep;
  }, [validationStep]);

  // Update distanceValidatedRef when distanceValidated changes
  useEffect(() => {
    distanceValidatedRef.current = distanceValidated;
  }, [distanceValidated]);

  // Update isCenteredRef when isCentered changes
  useEffect(() => {
    isCenteredRef.current = isCentered;
  }, [isCentered]);

  // Go to the next page details-liveness
  useEffect(() => {
    if (processCompleted) {
      if (processCompleted) {
        navigate("/details-liveness", { state: { ok } });
      }
    }
  }, [processCompleted, ok, navigate]);

  // Update counterRef when counter changes
  useEffect(() => {
    counterRef.current = counter;
  }, [counter]);

  // Start the webcam
  const startWebcam = async () => {
    const configWebcam = {
      facingMode: "user",
      width: { ideal: document.body.clientWidth },
      height: { ideal: document.body.clientHeight },
    };

    setIsModelLoading(true);

    const models = await human.models.list();

    const allModelsLoaded = models.every(
      (model) => model.loaded && model.size > 0
    );


    if (allModelsLoaded) {
      try {
        await human.webcam.start(configWebcam);
        videoRef.current.srcObject = human.webcam.stream;

        if (!human.webcam.stream?.active) {
          setMessage("La cámara no está disponible");
          setIsModelLoading(false);
          return;
        }

        setIsModelLoading(false);
        setIsWebcamActive(true);
        setShowButton(true);
        setMessage(null);
        startLiveness();
        startCounter();
        stepOne();


      } catch (error) {
        console.error("Failed to start webcam:", error);
      }
    } else {
      console.log("Models not loaded");
      setIsModelLoading(true);
    }
  };

  const startCounter = () => {
    setInterval(() => {
      setCounter((prevCounter) => (prevCounter > 0 ? prevCounter - 1 : 0));
    }, 1000);
  };


  // Toggle mirror effect
  const toggleMirror = () => {
    setIsMirrored(!isMirrored);
  };

  // Capture image from video
  const captureImage = () => {
    const video = videoRef.current;

    if (video && video.readyState >= 2) {
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const context = canvas.getContext("2d");
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageDataUrl = canvas.toDataURL("image/jpeg");

      localStorage.setItem("personImg", imageDataUrl);
    } else {
      console.log("Video no está listo o no disponible para captura");
    }
  };

  // Resize canvas
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
  };

  // Run detection
  const runDetection = async () => {
    if (videoRef.current && !human.webcam.paused && human.webcam.stream) {
      await human.detect(videoRef.current);
    }
  };

  // Step one
  const stepOne = () => {
    setTimeout(() => {
      setValidationStep(1);
    }, 5000);
  };

  // Process facial data
  const processFacialData = (distance) => {
    let validation = validationStepRef.current;
    let distanceValidated = distanceValidatedRef.current;
    let classInput = inputRef.current;
    setDistance(distance);

    if (validation === 1 && !distanceValidated) {
      if (distance >= 0.25 && distance <= 0.35) {
        classInput.className = "correct";
        distanceValidatedRef.current = true;
        validationStepRef.current = 2;
        setValidationMessage("Distancia correcta");
      } else if (distance < 0.25) {
        classInput.className = "incorrect";
        setValidationMessage("Retrocede");
      } else if (distance > 0.35) {
        classInput.className = "incorrect";
        setValidationMessage("Acércate");
      }
    }
  };

  // Capture face count data
  const captureFaceCountData = () => {
    setOk((prevState) => {
      // Copia el estado anterior
      let newState = { ...prevState };

      // Obtiene el nuevo valor de 'faceCount'
      let faceCountVal = human.result.face.length;

      // Agrega el nuevo valor 'faceCountVal' al arreglo 'val'
      let newVal = [...newState.faceCount.val, faceCountVal];

      // Encuentra el valor máximo en 'newVal'
      let maxVal = Math.max(...newVal);

      // Si 'maxVal' es mayor que 0, establece el estado de 'faceCount' en 'true'
      if (maxVal > 0) {
        newState.faceCount = {
          ...newState.faceCount,
          status: true,
          val: newVal,
        };
      }

      return newState;
    });
  };

  // Capture live data
  const captureFaceLiveData = (live) => {
    setOk((prevState) => {
      // Copia el estado anterior
      let newState = { ...prevState };

      // Agrega el nuevo valor 'live' al arreglo 'val'
      let newVal = [...newState.liveness.val, live];

      // Encuentra el valor máximo en 'newVal'
      let maxVal = Math.max(...newVal);

      // Si 'maxVal' es mayor que 'minConfidence', establece el estado de 'liveness' en 'true'
      if (maxVal >= options.minConfidence) {
        newState.liveness = {
          ...newState.liveness,
          status: true,
          val: newVal,
        };
      } else {
        newState.liveness = {
          ...newState.liveness,
          status: false,
          val: newVal,
        };
      }

      return newState;
    });
  };

  // Capture real data
  const captureRealData = (real) => {
    setOk((prevState) => {
      // Copia el estado anterior
      let newState = { ...prevState };

      // Agrega el nuevo valor 'real' al arreglo 'val'
      let newVal = [...newState.antispoof.val, real];

      // Encuentra el valor máximo en 'newVal'
      let maxVal = Math.max(...newVal);

      // Si 'maxVal' es mayor que 'minConfidence', establece el estado de 'antispoof' en 'true'
      if (maxVal >= options.minConfidence) {
        newState.antispoof = {
          ...newState.antispoof,
          status: true,
          val: newVal,
        };
      } else {
        newState.antispoof = {
          ...newState.antispoof,
          status: false,
          val: newVal,
        };
      }

      return newState;
    });
  };

  // Capture age data
  const captureAgeData = (age) => {
    setOk((prevState) => {
      // Copia el estado anterior
      let newState = { ...prevState };

      // Agrega el nuevo valor 'age' al arreglo 'val'
      let newVal = [...newState.age.val, age];

      // Encuentra el valor máximo en 'newVal'
      let maxVal = Math.max(...newVal);

      // Si 'maxVal' es mayor que 'minConfidence', establece el estado de 'age' en 'true'
      if (maxVal >= options.minConfidence) {
        newState.age = {
          ...newState.age,
          status: true,
          val: newVal,
        };
      } else {
        newState.age = {
          ...newState.age,
          status: false,
          val: newVal,
        };
      }

      return newState;
    });
  };

  // Capture Gender data
  const captureGenderData = (gender, genderScore) => {
    setOk((prevState) => {
      // Copia el estado anterior
      let newState = { ...prevState };

      // Agrega el nuevo valor 'gender' y 'genderScore' al arreglo 'val'
      let newVal = [...newState.gender.val, { gender, genderScore }];

      // Encuentra el valor máximo en 'genderScore'
      let maxVal = Math.max(...newVal.map((item) => item.genderScore));

      // Si 'maxVal' es mayor que 'minConfidence', establece el estado de 'gender' en 'true'
      if (maxVal >= options.minConfidence) {
        newState.gender = {
          ...newState.gender,
          status: true,
          val: newVal,
        };
      } else {
        newState.gender = {
          ...newState.gender,
          status: false,
          val: newVal,
        };
      }

      return newState;
    });
  };

  // Capture face confidence data
  const captureFaceConfidenceData = (faceConfidence) => {
    setOk((prevState) => {
      // Copia el estado anterior
      let newState = { ...prevState };

      // Agrega el nuevo valor 'faceConfidence' al arreglo 'val'
      let newVal = [...newState.faceConfidence.val, faceConfidence];

      // Encuentra el valor máximo en 'newVal'
      let maxVal = Math.max(...newVal);

      // Si 'maxVal' es mayor que 'minConfidence', establece el estado de 'faceConfidence' en 'true'
      if (maxVal >= options.minConfidence) {
        newState.faceConfidence = {
          ...newState.faceConfidence,
          status: true,
          val: newVal,
        };
      } else {
        newState.faceConfidence = {
          ...newState.faceConfidence,
          status: false,
          val: newVal,
        };
      }

      return newState;
    });
  };

  // Capture gesture data
  const captureGestureData = (gestures) => {
    setOk((prevState) => {
      let newState = { ...prevState };

      // Agrega los nuevos gestos al arreglo 'val'
      let newVal = [...newState.gestures.val, ...gestures];

      newState.gestures = {
        ...newState.gestures,
        val: newVal,
      };

      if (gestures.includes("facing center")) {
        newState.facingCenter = {
          ...newState.facingCenter,
          status: true,
        };
      }

      if (gestures.includes("looking center")) {
        newState.lookingCenter = {
          ...newState.lookingCenter,
          status: true,
        };
      }

      // Verifica si 'blinkDetected' existe en 'newState' antes de intentar cambiar su estado
      if (newState.blinkDetected) {
        let blinkLeftEye = gestures.includes("blink left eye");
        let blinkRightEye = gestures.includes("blink right eye");

        if (blinkLeftEye || blinkRightEye) {
          let newVal = [...newState.blinkDetected.val];

          if (blinkLeftEye) {
            newVal.push({ leftEye: true });
          }

          if (blinkRightEye) {
            newVal.push({ rightEye: true });
          }

          newState.blinkDetected = {
            ...newState.blinkDetected,
            status: true,
            val: newVal,
          };
        }
      }

      return newState;
    });
  };

  // Capture face size data
  const captureFaceSizeData = (face) => {
    setOk((prevState) => {
      // Copia el estado anterior
      let newState = { ...prevState };

      // Calcula el nuevo valor de 'faceSize'
      let faceSizeVal = Math.min(face.box[2], face.box[3]);

      // Agrega el nuevo valor 'faceSizeVal' al arreglo 'val'
      let newVal = [...newState.faceSize.val, faceSizeVal];

      // Encuentra el valor máximo en 'newVal'
      let maxVal = Math.max(...newVal);

      // Si 'maxVal' es mayor que 'minSize', establece el estado de 'faceSize' en 'true'
      if (maxVal >= options.minSize) {
        newState.faceSize = {
          ...newState.faceSize,
          status: true,
          val: newVal,
        };
      } else {
        newState.faceSize = {
          ...newState.faceSize,
          status: false,
          val: newVal,
        };
      }

      return newState;
    });
  };

  // Capture distance data
  const captureDistanceData = (distance) => {
    setOk((prevState) => {
      // Copia el estado anterior
      let newState = { ...prevState };

      // Obtiene el nuevo valor de 'distance'
      let distanceVal = distance || 0;

      // Agrega el nuevo valor 'distanceVal' al arreglo 'val'
      let newVal = [...newState.distance.val, distanceVal];

      // Encuentra el valor máximo en 'newVal'
      let maxVal = Math.max(...newVal);

      // Si 'maxVal' está dentro del rango permitido, establece el estado de 'distance' en 'true'
      if (maxVal >= options.distanceMin && maxVal <= options.distanceMax) {
        newState.distance = {
          ...newState.distance,
          status: true,
          val: newVal,
        };
      } else {
        newState.distance = {
          ...newState.distance,
          status: false,
          val: newVal,
        };
      }

      return newState;
    });
  };

  // Capture object data
  const captureObjectData = (object) => {
    if (!object || Object.keys(object).length === 0) {
      // Si el objeto está vacío, no hagas nada
      return;
    }

    setOk((prevState) => {
      // Copia el estado anterior
      let newState = { ...prevState };

      // Agrega el nuevo objeto al array val
      let newVal = [
        ...newState.object.val,
        { score: object.score, label: object.label },
      ];

      // Encuentra el score máximo en el array newVal
      let maxScore = Math.max(...newVal.map((obj) => obj.score));

      // Actualiza el estado basándote en el score máximo
      if (maxScore >= options.minConfidence) {
        newState.object = {
          ...newState.object,
          status: true,
          val: newVal,
        };
      } else {
        newState.object = {
          ...newState.object,
          status: false,
          val: newVal,
        };
      }
      return newState;
    });
  };

  // Check if the face is centered
  const isFaceAtCorrectDistance = (face) => {
    return face.distance >= minDistance && face.distance <= maxDistance;
  };

  // Check if the face is centered
  const isFaceCentered = (faceCenter, canvasCenter) => {
    return (
      Math.abs(faceCenter.faceCenterX - canvasCenter.canvasCenterX) < 20 &&
      Math.abs(faceCenter.faceCenterY - canvasCenter.canvasCenterY) < 20
    );
  };

  // Calculate face center
  const calculateFaceCenter = (faceBox) => {
    const faceCenterX = faceBox.x + faceBox.width / 2;
    const faceCenterY = faceBox.y + faceBox.height / 2;
    return { faceCenterX, faceCenterY };
  };

  // Calculate canvas center
  const calculateCanvasCenter = (canvas) => {
    const canvasCenterX = canvas.width / 2;
    const canvasCenterY = canvas.height / 2;
    return { canvasCenterX, canvasCenterY };
  };

  // Handle validation
  const updateFacialData = async (face, gestures, object) => {
    await processFacialData(face.distance);
    // Capture data
    await captureGenderData(face.gender, face.genderScore);
    await captureFaceConfidenceData(face.faceScore);
    await captureDistanceData(face.distance);
    await captureObjectData(object);
    await captureFaceLiveData(face.live);
    await captureGestureData(gestures);
    await captureFaceCountData(face);
    await captureRealData(face.real);
    await captureFaceSizeData(face);
    await captureAgeData(face.age);
  };

  // Handle validation
  const handleValidation = (isCentered, isAtCorrectDistance) => {
    let validationStep = validationStepRef.current;
    let msg1 = "Coloca tu rostro en el ovalo";
    let msg2 = "Espere un momento, estamos validando su rostro";

    if (validationStep === 2) {
      setTimeout(() => {
        setValidationMessage(msg1);
        setValidationStep(3);
      }, 2000);
    } else if (validationStep === 3 && isCentered && isAtCorrectDistance) {
      setTimeout(() => {
        setValidationMessage(msg2);
        setIsCentered(true);
        setValidationStep(4);
      }, 1000);
    } else if (validationStep === 4) {
      setTimeout(() => {
        captureImage();
        setIsWebcamActive(false);
        setProcessCompleted(true);
        setValidationStep(5);
        setShowButton(false);
        stopLiveness();
      }, 2000);
    }
  };

  // Draw an oval on the canvas
  const drawOval = (context, x, y, width, height) => {
    context.beginPath();
    context.ellipse(x, y, width, height, 0, 0, 2 * Math.PI);
    context.stroke();
  };

  // Update canvas
  const updateCanvas = async () => {
    try {
      requestAnimationFrame(updateCanvas);

      const canvas = canvasRef.current;
      const video = videoRef.current;

      if (!canvas || !video) {
        return;
      }

      const context = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      window.addEventListener("resize", resizeCanvas, false);
      resizeCanvas();

      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      let validatedCentered = isCenteredRef.current;
      const fill = validatedCentered ? "#7DCEA0" : "#F1948A";

      context.fillStyle = fill;
      context.fillRect(0, 0, canvas.width, canvas.height);

      // Later draw the oval
      context.globalCompositeOperation = "destination-out";

      if (isMobileDevice()) {
        drawOval(context, canvas.width / 2, canvas.height / 2, 160, 240);
      } else {
        drawOval(context, canvas.width / 2, canvas.height / 2, 180, 300);
      }

      context.fill();

      // Reset the context
      context.globalCompositeOperation = "source-over";
    } catch (error) {
      console.error(error);
    }
  };

  // TODO: Función para iniciar la detección de liveness
  // Start liveness detection
  const startLiveness = async () => {
    if (!human || !videoRef.current || !canvasRef.current) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    await runDetection();

    if (human.result.face.length > 0) {
      const face = human.result.face[0];
      const object = human.result.object[0];
      const [x, y, width, height] = face.box;
      const faceBox = { x, y, width, height };
      const gestures = Object.values(human.result.gesture).map(
        ({ gesture }) => gesture
      );

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      await updateFacialData(face, gestures, object);
      const faceCenter = calculateFaceCenter(faceBox);
      const canvasCenter = calculateCanvasCenter(canvas);
      const isCentered = isFaceCentered(faceCenter, canvasCenter);
      const isAtCorrectDistance = isFaceAtCorrectDistance(face);
      await handleValidation(isCentered, isAtCorrectDistance);
      await updateCanvas();
    } else {
      setValidationMessage("Colóca tu rostro frente a la cámara");
    }

    // setTimeout(startLiveness, 30);

    requestAnimationFrame(startLiveness);
  };

  // Stop the webcam
  const resetLiveness = () => {
    location.reload();
  };

  // Stop liveness detection
  const stopLiveness = async () => {
    if (human.webcam) {
      try {
        await human.webcam.stop();
        setIsWebcamActive(false);
        human.reset();
      } catch (error) {
        console.error("Failed to stop webcam:", error);
      }
    }
  };

  return (
    <Container className="pt-4">
      {isModelLoading && <LoaderPage />}

      {isWebcamActive && counter > 0 && (
        <div className="counter">
          <span>{counter}</span>
        </div>
      )}
      <h4 className="show-message">{message}</h4>

      <Button
        className="btn-camera shadow rounded-bottom-0 rounded-top-4"
        variant={isWebcamActive ? "danger" : "success"}
        onClick={isWebcamActive ? resetLiveness : startWebcam}
      >
        {isWebcamActive ? <FaStop /> : <FaPlay />}{" "}
        {isWebcamActive ? "Detener cámara" : "Iniciar cámara"}
      </Button>

      <input
        ref={inputRef}
        type={
          validationStepRef.current === 1 || validationStepRef.current === 2
            ? "range"
            : "hidden"
        }
        max={maxInputRange}
        value={distance}
        readOnly
      />

      <Transition in={isWebcamActive} timeout={duration} nodeRef={nodeRef}>
        {(state) => (
          <div
            style={{
              ...defaultStyle,
              ...transitionStyles[state],
            }}
            ref={nodeRef}
          >
            <div>
              <video
                className={`${isMirrored ? "mirror" : ""}`}
                ref={videoRef}
                autoPlay
                playsInline
              />
              <canvas
                ref={canvasRef}
                className={validationStepRef.current >= 3 ? "overlay" : "hide"}
              />
            </div>

            <Button
              variant="light"
              className="shadow close-button"
              onClick={resetLiveness}
            >
              <FaTimes />
            </Button>

            <Button
              variant="light"
              onClick={toggleMirror}
              className="shadow mirror-button"
            >
              <MdFlip />
            </Button>

            {showButton && (
              <span className="shadow instructions">{validationMessage}</span>
            )}
          </div>
        )}
      </Transition>
    </Container>
  );
};

export default Liveness;
