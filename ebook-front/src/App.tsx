import { ToastContainer } from "react-toastify";

import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./components/Layout/Layout";
import { configureAxiosRequestInterceptors } from "./services/AxiosConfiguration";

function App() {
  axios.defaults.withCredentials = true;
  configureAxiosRequestInterceptors();
  return (
    <>
      <Layout />
      <ToastContainer />
    </>
  );
}

export default App;
