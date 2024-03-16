import { Button, Container, Card, ListGroup } from "react-bootstrap";
import { FaPlay, FaTimes, FaCheck } from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import JsonView from "react18-json-view";
import "react18-json-view/src/style.css";
import { MdFlip } from "react-icons/md";
import Human from "@vladmandic/human";
import {} from "react-icons/fa6";
import "./Liveness.css";

const Test = () => {
  /* State variables */
  /* ---------------------------------- */
  // Human.js instance
  const [human, setHuman] = useState(null);
  const [startTime, setStartTime] = useState(0);
  const [timestamp, setTimestamp] = useState({ detect: 0, draw: 0 });

  // Webcam state
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [isMirrored, setIsMirrored] = useState(true);

  // Process state
  const [processCompleted, setProcessCompleted] = useState(false);
  const [listItems, setListItems] = useState([]);

  // useRef for the video and canvas elements
  const nodeRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // Blink detection
  const blink = { start: 0, end: 0, time: 0 };

  const [ok, setOk] = useState({
    faceCount: { status: false, val: 0, text: "Face count" },
    faceConfidence: { status: false, val: 0, text: "Face confidence" }, // % of face detected
    facingCenter: { status: false, val: 0, text: "Facing center" },
    lookingCenter: { status: false, val: 0, text: "Looking center" },
    blinkDetected: { status: false, val: 0, text: "Blink detected" },
    faceSize: { status: false, val: 0, text: "Face size" },
    antispoof: { status: false, val: 0, text: "Antispoof" }, // % of face detected
    liveness: { status: false, val: 0, text: "Liveness" }, // % of face detected
    distance: { status: false, val: 0, text: "Distance" }, // % of face detected
    age: { status: false, val: 0, text: "Age" },
    gender: { status: false, val: 0, text: "Gender" }, // % of face detected
    timeout: { status: true, val: 0, text: "Timeout" },
    descriptor: { status: false, val: 0, text: "Descriptor" },
    elapsedMs: { status: undefined, val: 0, text: "Elapsed ms" },
    detectFPS: { status: undefined, val: 0, text: "Detect FPS" },
    drawFPS: { status: undefined, val: 0, text: "Draw FPS" },
  });

  // Human.js config object for face detection
  useEffect(() => {
    // Detector Model: Puedes cambiar a 'ssd' o 'yolo' si necesitas mayor precisión y puedes permitirte un mayor tiempo de carga.
    const humanConfig = {
      debug: true,
      backend: "webgl",
      cacheSensitivity: 0,
      filter: { enabled: true, equalization: true },
      modelBasePath: "https://vladmandic.github.io/human/models/",
      face: {
        enabled: true,
        detector: {
          model: "blazeface",
          rotation: true,
          maxDetected: 1,
          return: true,
          mask: false,
        },
        emotion: { enabled: true },
        age: { enabled: true },
        gender: { enabled: true },
        liveness: { enabled: true },
        antispoof: { enabled: true },
        iris: { enabled: true },
      },
      body: { enabled: false },
      hand: { enabled: false },
      gesture: { enabled: true },
    };

    const humanInstance = new Human(humanConfig);
    setHuman(humanInstance);

    return () => {
      humanInstance.sleep();
    };
  }, []);

  const matchOptions = { order: 2, multiplier: 25, min: 0.2, max: 0.8 }; // for faceres model

  const options = {
    minConfidence: 0.6, // overal face confidence for box, face, gender, real, live
    minSize: 224, // min input to face descriptor model before degradation
    maxTime: 30000, // max time before giving up
    blinkMin: 10, // minimum duration of a valid blink
    blinkMax: 800, // maximum duration of a valid blink
    distanceMin: 0.3, // closest that face is allowed to be to the cammera in cm
    distanceMax: 0.6, // farthest that face is allowed to be to the cammera in cm
    ...matchOptions,
  };

  const allOk = () => {
    return (
      ok.faceCount.status &&
      ok.faceSize.status &&
      ok.blinkDetected.status &&
      ok.facingCenter.status &&
      ok.lookingCenter.status &&
      ok.faceConfidence.status &&
      ok.antispoof.status &&
      ok.liveness.status &&
      ok.distance.status &&
      ok.descriptor.status &&
      ok.age.status &&
      ok.gender.status
    );
  };

  const log = (...msg) => {
    console.log(...msg);
  };

  const runDetection = async () => {
    if (human.webcam) {
      await human.detect(videoRef.current);
      const now = human.now();
      setTimestamp((prev) => ({ ...prev, detect: now }));
      requestAnimationFrame(runDetection);
    }
  };

  const drawValidationTests = () => {
    const newOk = { ...ok };
    const listItems = [];

    const percentageKeys = [
      "faceConfidence",
      "antispoof",
      "liveness",
      "gender",
    ];

    for (const [key, val] of Object.entries(ok)) {
      if (typeof val.status === "boolean") {
        const status = val.status ? "ok" : "fail";
        let valueText = val.val === 0 ? status : val.val;
        if (percentageKeys.includes(key)) {
          valueText = `${valueText * 100}%`;
        }
        if (key === "distance") {
          valueText = `${valueText} cm`;
        }
        const text = `${val.text}: ${valueText}`;
        const variant = val.status ? "success" : "danger";

        listItems.push({ text, variant });
      }
    }

    setOk(newOk);

    setListItems(listItems);
  };

  const validationLoop = async () => {
    const now = human.now();

    ok.drawFPS.val = Math.round(10000 / (now - timestamp.draw)) / 10;
    timestamp.draw = now;
    ok.faceCount.val = human.result.face.length;
    ok.faceCount.status = ok.faceCount.val === 1;

    if (ok.faceCount.status) {
      // skip the rest if no face
      const gestures = Object.values(human.result.gesture).map(
        (gesture) => gesture.gesture
      );

      if (
        gestures.includes("blink left eye") ||
        gestures.includes("blink right eye")
      )
        blink.start = human.now();

      if (
        blink.start > 0 &&
        !gestures.includes("blink left eye") &&
        !gestures.includes("blink right eye")
      )
        blink.end = human.now();

      ok.blinkDetected.status =
        ok.blinkDetected.status ||
        (Math.abs(blink.end - blink.start) > options.blinkMin &&
          Math.abs(blink.end - blink.start) < options.blinkMax);

      if (ok.blinkDetected.status && blink.time === 0)
        blink.time = Math.trunc(blink.end - blink.start);

      ok.facingCenter.status = gestures.includes("facing center");
      ok.lookingCenter.status = gestures.includes("looking center");
      ok.faceConfidence.val =
        human.result.face[0].faceScore || human.result.face[0].boxScore || 0;
      ok.faceConfidence.status = ok.faceConfidence.val >= options.minConfidence;
      ok.antispoof.val = human.result.face[0].real || 0;
      ok.antispoof.status = ok.antispoof.val >= options.minConfidence;
      ok.liveness.val = human.result.face[0].live || 0;
      ok.liveness.status = ok.liveness.val >= options.minConfidence;

      ok.faceSize.val = Math.min(
        human.result.face[0].box[2],
        human.result.face[0].box[3]
      );

      ok.faceSize.status = ok.faceSize.val >= options.minSize;
      ok.distance.val = human.result.face[0].distance || 0;
      ok.distance.status =
        ok.distance.val >= options.distanceMin &&
        ok.distance.val <= options.distanceMax;
      ok.descriptor.val = human.result.face[0].embedding?.length || 0;
      ok.descriptor.status = ok.descriptor.val > 0;
      ok.age.val = human.result.face[0].age || 0;
      ok.age.status = ok.age.val > 0;
      ok.gender.val = human.result.face[0].genderScore || 0;
      ok.gender.status = ok.gender.val >= options.minConfidence;
    }

    ok.elapsedMs.val = human.now() - startTime; // Agregado
    ok.timeout.status = ok.elapsedMs.val <= options.maxTime;

    drawValidationTests();

    if (allOk() || !ok.timeout.status) {
      stopWebcam();
      setIsWebcamActive(false);
      return human.result.face[0];
    }

    setStartTime((prev) => prev + 30);

    return new Promise((resolve) => {
      setTimeout(async () => {
        const result = await validationLoop();
        resolve(result);
      }, 30);
    });
  };

  // Start the webcam
  const startWebcam = async () => {
    if (!human.webcam) {
      console.error("Webcam not available");
      return;
    }

    try {
      await human.webcam.start({
        facingMode: "user",
        resizeMode: "crop-and-scale",
        width: { ideal: document.body.clientWidth },
        height: { ideal: document.body.clientHeight },
      });

      restartAll();
      videoRef.current.srcObject = human.webcam.stream;
      setProcessCompleted(false);
      setIsWebcamActive(true);
      startLiveness();
    } catch (error) {
      console.error("Failed to start webcam:", error);
    }
  };

  // Stop the webcam
  const stopWebcam = async () => {
    if (human.webcam && isWebcamActive) {
      try {
        await human.webcam.pause();
        stopLiveness();
      } catch (error) {
        console.error("Failed to pause webcam:", error);
      }
    }
  };

  // Start liveness detection
  const startLiveness = async () => {
    // Verify if human and videoRef.current are available
    if (!human || !videoRef.current) {
      console.log("Camera not active or video not loaded");
      return;
    }

    setStartTime(human.now());
    const objects = human.result.object;

    if (objects.length > 0) {
      console.log(
        "Objeto detectado, colocate en un lugar sin obejots y con buena iluminacion"
      );
    }

    await runDetection();
    await validationLoop();

    if (!allOk()) {
      log("did not find valid face");
      stopLiveness();
      setProcessCompleted(true);
      return false;
    } else {
      stopLiveness();
      setProcessCompleted(true);
    }

    console.log(ok);
  };

  // Stop liveness detection
  const stopLiveness = async () => {
    if (human) {
      human.sleep();
    }
  };

  // Reset all
  const restartAll = () => {
    // Reset data to be validated
    setOk({
      faceSize: { status: false, val: [], text: "Face size" },
      faceCount: { status: false, val: [], text: "Face count" },
      faceConfidence: { status: false, val: [], text: "Face confidence" },
      gestures: { val: [], text: "Gestures" },
      facingCenter: { status: false, text: "Facing center" },
      lookingCenter: { status: false, text: "Looking center" },
      blinkDetected: { status: false, val: [], text: "Blink detected" },
      antispoof: { status: false, val: [], text: "Antispoof" },
      liveness: { status: false, val: [], text: "Liveness" },
      distance: { status: false, val: [], text: "Distance" },
      gender: { status: false, val: [], text: "Gender" },
      age: { status: false, val: [], text: "Age" },
      descriptor: { status: false, val: [], text: "Descriptor" },
      timeout: { status: true, val: 0, text: "Timeout" },
      elapsedMs: { status: undefined, val: 0, text: "Elapsed ms" },
      detectFPS: { status: undefined, val: 0, text: "Detect FPS" },
      drawFPS: { status: undefined, val: 0, text: "Draw FPS" },
    });

    setProcessCompleted(false);
    setListItems([]);
    setIsMirrored(true);
    setIsWebcamActive(false);
    setStartTime(0);
    blink.start = 0;
    blink.end = 0;
    blink.time = 0;
  };


  const renderResultCard = () => {
    return (
      <Card className="m-5" bg="dark" text="white">
        <Card.Body>
          <JsonView src={ok} />
        </Card.Body>
      </Card>
    );
  };

  const renderValidationList = () => {
    return (
      <ListGroup>
        {listItems.map((item, index) => (
          <ListGroup.Item
            key={index}
            variant={item.variant}
            className={`d-flex justify-content-between align-items-center ${item.variant}`}
          >
            {item.text}
            {item.variant === "success" ? <FaCheck /> : <FaTimes />}
          </ListGroup.Item>
        ))}
      </ListGroup>
    );
  };

  return (
    <Container className="pt-4">
      {!isWebcamActive && (
        <h4 className="text-center text-light mb-5">
          Active la cámara para iniciar el proceso de validación
        </h4>
      )}

      {!isWebcamActive && (
        <Button
          className="btn-camera shadow rounded-bottom-0 rounded-top-4"
          variant="success"
          onClick={startWebcam}
        >
          <FaPlay />
          &nbsp; Iniciar cámara
        </Button>
      )}

      {isWebcamActive && (
        <div ref={nodeRef}>
          <div>
            <video className="" ref={videoRef} autoPlay playsInline />
            <canvas ref={canvasRef} />
          </div>
        </div>
      )}

      {processCompleted && renderResultCard()}

      {!processCompleted && renderValidationList()}
    </Container>
  );
};

export default Test;
