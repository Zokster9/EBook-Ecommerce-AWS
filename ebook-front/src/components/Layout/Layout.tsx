import { BrowserRouter } from "react-router-dom";
import { ShoppingCartProvider } from "../../context/ShoppingCartContext";
import { UserProvider } from "../../context/UserContext";
import AppRouter from "../AppRouter/AppRouter";
import Header from "../Header/Header";

const Layout = () => {
  return (
    <UserProvider>
      <ShoppingCartProvider>
        <BrowserRouter>
          <Header />
          <AppRouter />
        </BrowserRouter>
      </ShoppingCartProvider>
    </UserProvider>
  );
};

export default Layout;
