import FaceRecognition from "../pages/FaceRecognition/FaceRecognition";
import FaceComparison from "../pages/FaceComparison/FaceComparison";
import DetailsLiveness from "../pages/Liveness/DetailsLiveness";
import { Route, Routes, Navigate } from "react-router-dom";
import RouteTransition from "../utils/RouteTransition";
import Liveness from "../pages/Liveness/Liveness";
import NotFound from "../pages/NotFound/NotFound";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../pages/Login/Login";
import Home from "../pages/Home/Home";

// New import
import Test from "../pages/Liveness/Test";

const AppRoutes = () => (
  <Routes>
    <Route
      path="/login"
      element={
        <RouteTransition>
          <Login />
        </RouteTransition>
      }
    />
    <Route element={<ProtectedRoute />}>
      <Route
        path="/"
        element={
          <RouteTransition>
            <Home />
          </RouteTransition>
        }
      />
      <Route
        path="/liveness"
        element={
          <RouteTransition>
            <Liveness />
          </RouteTransition>
        }
      />
      <Route
        path="/face-recognition"
        element={
          <RouteTransition>
            <FaceRecognition />
          </RouteTransition>
        }
      />
      <Route
        path="/details-liveness"
        element={
          <RouteTransition>
            <DetailsLiveness />
          </RouteTransition>
        }
      />
      <Route
        path="/face-comparison"
        element={
          <RouteTransition>
            <FaceComparison />
          </RouteTransition>
        }
      />
      <Route
        path="/test"
        element={
          <RouteTransition>
            <Test />
          </RouteTransition>
        }
      />
      <Route
        path="*"
        element={
          <RouteTransition>
            <NotFound />
          </RouteTransition>
        }
      />
    </Route>
    <Route path="*" element={<Navigate to="/login" />} />
  </Routes>
);

export default AppRoutes;
