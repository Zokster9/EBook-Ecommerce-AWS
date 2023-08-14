import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";

const LoginPage = () => {
  return (
    <Container className="border border-1 p-3">
      <div className="mb-3">
        <h2>Login</h2>
      </div>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <FloatingLabel
            controlId="floatingInput"
            label="Email address"
            className="mb-3"
          >
            <Form.Control type="email" placeholder="name@example.com" />
          </FloatingLabel>
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <FloatingLabel controlId="floatingPassword" label="Password">
            <Form.Control type="password" placeholder="Password" />
          </FloatingLabel>
        </Form.Group>

        <div className="d-flex justify-content-center text-align-center">
          <Button variant="dark" type="submit" className="w-25">
            Submit
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default LoginPage;
