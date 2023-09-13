import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { AxiosError } from "axios";
import * as formik from "formik";
import { useRef } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Image from "react-bootstrap/Image";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import defaultAvatar from "../../assets/default_profile_pic.jpeg";
import { UserCreationDTO } from "../../model/user-creation-dto";
import { register } from "../../services/Auth";
import { nameRegex, passwordRegex, usernameRegex } from "../../utils/utils";

const RegisterPage = () => {
  const { Formik } = formik;

  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const handleUploadAvatarClick = () => {
    if (hiddenFileInput.current) hiddenFileInput.current.click();
  };

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
    passwordConfirmation: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required(),
    username: yup
      .string()
      .matches(usernameRegex, "Username must be at least 8 characters long")
      .required(),
    firstName: yup
      .string()
      .matches(nameRegex, "Name must start with an uppercase letter")
      .required(),
    lastName: yup
      .string()
      .matches(nameRegex, "Last name must start with an uppercase letter")
      .required(),
    avatar: yup.mixed().notRequired().nullable(),
  });

  const onSubmit = (values: any, actions: any) => {
    const user: UserCreationDTO = { ...values };
    register(user)
      .then((message) => {
        toast.success(message.data);
        navigate("/login");
        actions.setSubmitting(false);
      })
      .catch((err: AxiosError<string>) => {
        toast.error(err.response?.data);
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
        passwordConfirmation: "",
        username: "",
        firstName: "",
        lastName: "",
        avatar: null,
      }}
    >
      {({
        handleSubmit,
        handleChange,
        setFieldValue,
        values,
        errors,
        isSubmitting,
      }) => (
        <Container className="border border-1 p-3">
          <div className="mb-3">
            <h2>Register</h2>
          </div>
          <div className="d-flex flex-column justify-content-center align-items-center gap-2 mb-2">
            <Image
              className="object-fit-cover"
              src={values.avatar || defaultAvatar}
              rounded
              height={250}
              width={400}
            />
            <Button
              variant="primary"
              size="lg"
              className="w-50 p-2"
              onClick={handleUploadAvatarClick}
            >
              <CloudUploadIcon />
              <span> Upload an avatar</span>
              <input
                name="avatar"
                accept="image/*"
                id="contained-button-file"
                type="file"
                hidden
                ref={hiddenFileInput}
                onChange={(e) => {
                  const fileReader = new FileReader();
                  fileReader.onload = () => {
                    if (fileReader.readyState === 2) {
                      setFieldValue("avatar", fileReader.result);
                    }
                  };
                  fileReader.readAsDataURL(e.target.files![0]);
                }}
              />
            </Button>
          </div>
          <Form noValidate onSubmit={handleSubmit}>
            <Form.Group className="mb-3 position-relative" controlId="username">
              <FloatingLabel controlId="username" label="Username">
                <Form.Control
                  type="text"
                  name="username"
                  placeholder="Enter your username..."
                  value={values.username}
                  onChange={handleChange}
                  isInvalid={!!errors.username}
                />
                <Form.Control.Feedback type="invalid" tooltip>
                  {errors.username}
                </Form.Control.Feedback>
              </FloatingLabel>
            </Form.Group>

            <Form.Group className="mb-3 position-relative" controlId="email">
              <FloatingLabel controlId="email" label="Email address">
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

            <Form.Group className="mb-3 position-relative" controlId="password">
              <FloatingLabel controlId="password" label="Password">
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

            <Form.Group
              className="mb-3 position-relative"
              controlId="passwordConfirmation"
            >
              <FloatingLabel
                controlId="passwordConfirmation"
                label="Confirm password"
              >
                <Form.Control
                  type="password"
                  placeholder="Confirm password"
                  name="passwordConfirmation"
                  value={values.passwordConfirmation}
                  onChange={handleChange}
                  isInvalid={!!errors.passwordConfirmation}
                />
                <Form.Control.Feedback type="invalid" tooltip>
                  {errors.passwordConfirmation}
                </Form.Control.Feedback>
              </FloatingLabel>
            </Form.Group>

            <Form.Group
              className="mb-3 position-relative"
              controlId="firstName"
            >
              <FloatingLabel controlId="firstName" label="First name">
                <Form.Control
                  type="text"
                  placeholder="Enter your first nam..."
                  name="firstName"
                  value={values.firstName}
                  onChange={handleChange}
                  isInvalid={!!errors.firstName}
                />
                <Form.Control.Feedback type="invalid" tooltip>
                  {errors.firstName}
                </Form.Control.Feedback>
              </FloatingLabel>
            </Form.Group>

            <Form.Group className="mb-3 position-relative" controlId="lastName">
              <FloatingLabel controlId="lastName" label="Last name">
                <Form.Control
                  type="text"
                  placeholder="Enter your last name"
                  name="lastName"
                  value={values.lastName}
                  onChange={handleChange}
                  isInvalid={!!errors.lastName}
                />
                <Form.Control.Feedback type="invalid" tooltip>
                  {errors.lastName}
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

export default RegisterPage;
