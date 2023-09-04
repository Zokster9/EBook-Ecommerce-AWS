import { AxiosError } from "axios";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../../assets/ebook.svg";
import { useShoppingCart } from "../../context/ShoppingCartContext";
import { useUser } from "../../context/UserContext";
import { logout } from "../../services/Auth";
import CartIcon from "../CartIcon/CartIcon";
import WishlistIcon from "../WishlistIcon/WishlistIcon";

const Header = () => {
  const { openCart, cartQuantity } = useShoppingCart();
  const { user, logoutUser, openWishlist } = useUser();

  const logOut = () => {
    logout()
      .then((_) => {
        logoutUser();
        localStorage.removeItem("token");
        toast.success("Successfully logged out");
      })
      .catch((err: AxiosError<{ message: string }>) => {
        toast.error(err.response?.data.message);
      });
  };
  return (
    <Navbar
      sticky="top"
      bg="dark"
      data-bs-theme="dark"
      className="shadow-sm mb-4"
    >
      <Container>
        <Navbar.Brand to="/home" as={NavLink}>
          <img
            src={logo}
            width="130"
            height="40"
            style={{ objectFit: "cover" }}
            className="d-inline-block align-top"
            alt="EBook logo"
          />
        </Navbar.Brand>
        <Navbar.Collapse>
          {/* <Form className="d-flex">
            <Form.Control
              htmlSize={100}
              type="search"
              placeholder="Search"
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-success">Search</Button>
          </Form> */}
          {!user.id ? (
            <>
              <Nav className="ms-auto">
                <Nav.Link to="login" as={NavLink}>
                  Sign in
                </Nav.Link>
              </Nav>
              <Nav>
                <Nav.Link to="register" as={NavLink}>
                  Register
                </Nav.Link>
              </Nav>
            </>
          ) : (
            <div className="d-flex justify-content-around align-items-center ms-auto gap-2">
              {cartQuantity > 0 && (
                <Button
                  onClick={openCart}
                  style={{
                    width: "3rem",
                    height: "3rem",
                    position: "relative",
                  }}
                  variant="outline-primary"
                  className="rounded-circle"
                >
                  <CartIcon quantity={cartQuantity} />
                </Button>
              )}
              {user.wishlistBooks!.length > 0 && (
                <Button
                  onClick={openWishlist}
                  style={{
                    width: "3rem",
                    height: "3rem",
                    position: "relative",
                  }}
                  variant="outline-primary"
                  className="rounded-circle"
                >
                  <WishlistIcon quantity={user.wishlistBooks!.length} />
                </Button>
              )}
              <Nav onClick={logOut}>
                <Nav.Link to="login" as={NavLink}>
                  Logout
                </Nav.Link>
              </Nav>
            </div>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
