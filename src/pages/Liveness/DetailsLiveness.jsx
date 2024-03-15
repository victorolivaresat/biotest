import { useLocation, useNavigate } from "react-router-dom";
import { PiSealCheckBold, PiInfoThin } from "react-icons/pi";
import { Card, Row, Col, Button } from "react-bootstrap";
import VerifiedGif from "../../assets/images/check.gif";
import { CgLivePhoto, CgRuler } from "react-icons/cg";
import ErrorIcon from "../../assets/images/error.png";
import { RiEyeCloseLine } from "react-icons/ri";
import LoaderPage from "../../utils/LoaderPage";
import { LuScanFace } from "react-icons/lu";
import { useEffect, useState } from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import {
  BsEye,
  BsGenderMale,
  BsGenderFemale,
  BsPersonCheckFill,
} from "react-icons/bs";
import {
  MdFace,
  MdSportsScore,
  MdPhotoSizeSelectSmall,
  MdOutlineManageHistory,
} from "react-icons/md";

const DetailsLiveness = () => {
  const location = useLocation();
  const { ok } = location.state;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  console.log(ok)

 
  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timeout);
    
  }, []);
  

  const isStatusTrue = (status) => {
    return status === true;
  };

  const isPersonValid = isStatusTrue(ok.object.status);
  const storedImage = localStorage.getItem("personImg");
  const faceConfidence = Math.max(...ok.faceConfidence.val);
  const maxAntispoof = Math.max(...ok.antispoof.val);
  const maxDistance = Math.max(...ok.distance.val);
  const maxFaceSize = Math.max(...ok.faceSize.val);
  const maxLiveness = Math.max(...ok.liveness.val);
  const age = ok.age.val[ok.age.val.length - 1];
  const lookingCenter = ok.lookingCenter.status;
  const blinkDetected = ok.blinkDetected.status;
  const facingCenter = ok.facingCenter.status;
  const maxGenderScore = ok.gender.val.reduce(
    (max, obj) => (obj.genderScore > max.genderScore ? obj : max),
    ok.gender.val[0]
  );

  return (
    <>
      {loading ? (
        <LoaderPage />
      ) : (
      <Card className="m-5" bg="dark" text="white">
        <Card.Header className="px-3">
          <PiInfoThin />
          &nbsp; Resultado de la validación
        </Card.Header>
        <Card.Body>
          <Row className="justify-content-center py-3 rounded-3">
            <Col lg={6}>
              <img
                className="img-fluid rounded-3 mx-auto d-block shadow"
                alt="Capture"
                width={500}
                src={storedImage}
              />
            </Col>
            <Col lg={6}>
              <Tabs
                defaultActiveKey="liveness"
                id="fill-tab"
                className="my-3"
                fill
              >
                <Tab
                  eventKey="liveness"
                  title={
                    <>
                      <MdFace /> Face Liveness
                    </>
                  }
                >
                  <div className="p-3 table-responsive">
                    <table className="table table-dark table-borderless fs-5">
                      <tbody>
                        <tr>
                          <td>
                            <CgLivePhoto />
                            &nbsp; Liveness:
                          </td>
                          <td>{maxLiveness.toFixed(2) * 100}%</td>
                        </tr>
                        <tr>
                          <td>
                            <MdOutlineManageHistory />
                            &nbsp; Edad:
                          </td>
                          <td>{ Math.round(age)}</td>
                        </tr>
                        <tr>
                          <td>
                            {maxGenderScore.gender === "male" ? (
                              <BsGenderMale />
                            ) : (
                              <BsGenderFemale />
                            )}
                            &nbsp; Género:
                          </td>
                          <td>
                            {maxGenderScore.gender === "male"
                              ? `M (${
                                  Math.round(maxGenderScore.genderScore * 100)
                                }%)`
                              : `F (${
                                  Math.round(maxGenderScore.genderScore * 100)
                                }%)`}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <BsPersonCheckFill />
                            &nbsp; Real:
                          </td>
                          <td>{maxAntispoof * 100}%</td>
                        </tr>
                        <tr>
                          <td>
                            <PiSealCheckBold />
                            &nbsp; Nivel de Confianza:
                          </td>
                          <td>{faceConfidence * 100}%</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Tab>
                <Tab
                  eventKey="scores"
                  title={
                    <>
                      <MdSportsScore /> Aditional Scores
                    </>
                  }
                >
                  <div className="p-3 table-responsive">
                    <table className="table table-dark table-borderless fs-5">
                      <tbody>
                        <tr>
                          <td>
                            <MdPhotoSizeSelectSmall />
                            &nbsp; Face Size:
                          </td>
                          <td>{maxFaceSize}px</td>
                        </tr>
                        <tr>
                          <td>
                            <CgRuler />
                            &nbsp; Distance:
                          </td>
                          <td>{ Math.round(maxDistance * 100)}cm</td>
                        </tr>
                        <tr>
                          <td>
                            <LuScanFace />
                            &nbsp; Facing Center:
                          </td>
                          <td>{facingCenter ? "Detectado" : "No detectado"}</td>
                        </tr>
                        <tr>
                          <td>
                            <BsEye />
                            &nbsp; Looking Center:
                          </td>
                          <td>
                            {lookingCenter ? "Detectado" : "No Detectado"}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <RiEyeCloseLine />
                            &nbsp; Blink Detected:
                          </td>
                          <td>
                            {blinkDetected ? "Detectado" : "No Detectado"}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Tab>
              </Tabs>
            </Col>
            <Col lg={12} className="text-center mt-2">
              <div className="mb-3">
                <img
                  src={isPersonValid ? VerifiedGif : ErrorIcon}
                  alt="Verificado"
                  width={80}
                />
              </div>
              <span className="text-bg-success">
                <h5>Proceso Finalizado</h5>
                {isPersonValid ? (
                  <p>
                    <strong>¡Validación exitosa!</strong> El proceso se ha
                    completado con éxito. Haz clic en continuar.
                  </p>
                ) : (
                  <p>
                    <strong>¡Error de validación!</strong> Parece que ha
                    ocurrido un problema durante el proceso. Por favor, revisa
                    la información e inténtalo nuevamente.
                  </p>
                )}
              </span>
              <Button
                variant="success"
                className="shadow rounded-3 mt-3"
                onClick={() => navigate("/face-recognition")}
                disabled={!isPersonValid}
              >
                Continuar
              </Button>

              <Button
                variant="danger"
                className="shadow rounded-3 mt-3 mx-3"
                onClick={() => navigate("/liveness")}
                disabled={isPersonValid}
              >
                Reiniciar
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      )}
    </>
  );
};

export default DetailsLiveness;
