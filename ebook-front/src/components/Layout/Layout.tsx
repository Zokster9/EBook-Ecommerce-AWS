import { BrowserRouter } from "react-router-dom";
import { ShoppingCartProvider } from "../../context/ShoppingCartContext";
import AppRouter from "../AppRouter/AppRouter";
import Header from "../Header/Header";

const Layout = () => {
  return (
    <ShoppingCartProvider>
      <BrowserRouter>
        <Header />
        <AppRouter />
      </BrowserRouter>
    </ShoppingCartProvider>
  );
};

export default Layout;
