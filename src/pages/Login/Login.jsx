import { Button, Form, Container, Row, Col, Card } from "react-bootstrap";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import Logo from "../../assets/images/logo.png";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import "./Login.css";

const Login = () => {
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { loginUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const { email, password } = data;
    await loginUser(email, password);
  };

  useEffect(() => {
    if (isAuthenticated) {
      console.log("Usuario autenticado", isAuthenticated);
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const [showPassword, setShowPassword] = useState(false);
  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Row className="justify-content-md-center">
        <Col xs={12} md={8} lg={6} className="w-100">
          <Card className="login-card rounded-5 shadow">
            <Card.Body>
              <img className="my-5 logo-login" src={Logo} alt="Logo" />
              <Form onSubmit={handleSubmit(onSubmit)} className="p-2">
                <Form.Group className="mb-4" controlId="formBasicEmail">
                  <Form.Label>Email:</Form.Label>
                  <Form.Control
                    type="email"
                    autoFocus
                    {...register("email", {
                      required: "El correo es requerido",
                    })}
                  />
                  {errors.email && (
                    <span className="text-danger">{errors.email.message}</span>
                  )}
                </Form.Group>
                <Form.Group className="mb-5">
                  <div className="float-end">
                    <small>
                      <a href="#" className="forget-password ">
                        Olvidaste tu contraseña
                      </a>
                    </small>
                  </div>
                  <Form.Label>Contraseña:</Form.Label>
                  <div className="input-group">
                    <Form.Control
                      type={showPassword ? "text" : "password"}
                      {...register("password", {
                        required: "La contraseña es requerida",
                      })}
                    />
                    <div
                      className="input-group-text"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                    </div>
                  </div>
                  {errors.password && (
                    <span className="text-danger">
                      {errors.password.message}
                    </span>
                  )}
                </Form.Group>
                <Button
                  className="mb-3 d-block w-100 rounded-5"
                  variant="primary"
                  type="submit"
                >
                  Login
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
