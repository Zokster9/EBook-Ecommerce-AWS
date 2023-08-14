import { ToastContainer } from "react-toastify";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./components/Layout/Layout";

function App() {
  return (
    <>
      <Layout />
      <ToastContainer />
    </>
  );
}

export default App;
