import { AxiosError } from "axios";
import * as formik from "formik";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useUser } from "../../context/UserContext";
import { login } from "../../services/Auth";
import { passwordRegex } from "../../utils/utils";

const LoginPage = () => {
  const { Formik } = formik;
  const { loginUser } = useUser();
  const navigate = useNavigate();

  const schema = yup.object().shape({
    email: yup.string().email().required(),
    password: yup
      .string()
      .matches(
        passwordRegex,
        "Password must be at least 12 characters long with an uppercase letter, number and a special character."
      )
      .required(),
  });

  const onSubmit = (
    values: { email: string; password: string },
    actions: any
  ) => {
    login(values.email, values.password)
      .then((userDTO) => {
        loginUser(userDTO);
        toast.success("You have successfully logged in");
        actions.setSubmitting(false);
        navigate("/home");
      })
      .catch((err: AxiosError<{ message: string }>) => {
        console.error(err);
        toast.error(err.response?.data.message);
        actions.setSubmitting(false);
      });
  };

  return (
    <Formik
      validationSchema={schema}
      onSubmit={onSubmit}
      initialValues={{
        email: "",
        password: "",
      }}
    >
      {({ handleSubmit, handleChange, values, errors, isSubmitting }) => (
        <Container className="border border-1 p-3">
          <div className="mb-3">
            <h2>Login</h2>
          </div>
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group
              className="mb-3 position-relative"
              controlId="validationFormik101"
            >
              <FloatingLabel
                controlId="validationFormik101"
                label="Email address"
              >
                <Form.Control
                  type="email"
                  placeholder="name@example.com"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                  isInvalid={!!errors.email}
                />
                <Form.Control.Feedback type="invalid" tooltip>
                  {errors.email}
                </Form.Control.Feedback>
              </FloatingLabel>
            </Form.Group>

            <Form.Group
              className="mb-3 position-relative"
              controlId="validationFormik102"
            >
              <FloatingLabel controlId="floatingPassword" label="Password">
                <Form.Control
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                  isInvalid={!!errors.password}
                />
                <Form.Control.Feedback type="invalid" tooltip>
                  {errors.password}
                </Form.Control.Feedback>
              </FloatingLabel>
            </Form.Group>

            <div className="d-flex justify-content-center text-align-center">
              <Button
                disabled={isSubmitting}
                variant="dark"
                type="submit"
                className="w-25"
              >
                Submit
              </Button>
            </div>
          </Form>
        </Container>
      )}
    </Formik>
  );
};

export default LoginPage;
