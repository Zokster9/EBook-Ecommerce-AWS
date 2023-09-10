import { ToastContainer } from "react-toastify";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import Layout from "./components/Layout/Layout";
import { configureAxiosRequestInterceptors } from "./services/AxiosConfiguration";

function App() {
  configureAxiosRequestInterceptors();
  return (
    <PayPalScriptProvider
      options={{ clientId: process.env.REACT_APP_PAYPAL_CLIENT_ID! }}
    >
      <Layout />
      <ToastContainer />
    </PayPalScriptProvider>
  );
}

export default App;
