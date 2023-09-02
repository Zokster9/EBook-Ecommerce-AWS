import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink } from "react-router-dom";
import logo from "../../assets/ebook.svg";
import { useShoppingCart } from "../../context/ShoppingCartContext";
import { useUser } from "../../context/UserContext";
import CartIcon from "../CartIcon/CartIcon";

const Header = () => {
  const { openCart, cartQuantity } = useShoppingCart();
  const { getUser, logoutUser } = useUser();

  const user = getUser();

  const logout = () => {
    logoutUser();
    localStorage.removeItem("token");
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
            height="35"
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
            <>
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
              <Nav className="ms-auto" onClick={logout}>
                <Nav.Link to="login" as={NavLink}>
                  Logout
                </Nav.Link>
              </Nav>
            </>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
