import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "./layout/Layout";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

const App = () => {
  return (
    <BrowserRouter>
      <ToastContainer position="top-center"/>
      <Layout />
    </BrowserRouter>
  );
};

export default App;