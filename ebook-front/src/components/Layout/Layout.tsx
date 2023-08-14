import { BrowserRouter } from "react-router-dom";
import AppRouter from "../AppRouter/AppRouter";
import Header from "../Header/Header";

const Layout = () => {
  return (
    <BrowserRouter>
      <Header />
      <AppRouter />
    </BrowserRouter>
  );
};

export default Layout;
