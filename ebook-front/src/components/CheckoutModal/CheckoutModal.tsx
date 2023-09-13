import { AxiosError } from "axios";
import * as formik from "formik";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Stack from "react-bootstrap/Stack";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useShoppingCart } from "../../context/ShoppingCartContext";
import { useUser } from "../../context/UserContext";
import { getBookById } from "../../services/BookService";
import { buyItems } from "../../services/UserService";
import { formatCurrency } from "../../utils/utils";
import CartItem from "../CartItem/CartItem";

type CheckoutModalProps = {
  show: boolean;
  onCloseModal: () => void;
};

const CheckoutModal = ({ show, onCloseModal }: CheckoutModalProps) => {
  const { cartItems } = useShoppingCart();
  const [totalPriceFormatted, setTotalPriceFormatted] = useState<string>("0");
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const { Formik } = formik;
  const { user, updateUser } = useUser();

  const schema = yup.object().shape({
    giftSwitch: yup.boolean(),
    friendEmail: yup
      .string()
      .email("Enter a valid email")
      .when("giftSwitch", {
        is: true,
        then: (schema) => schema.required("Must enter email address"),
      }),
  });

  useEffect(() => {
    cartItems
      .reduce<Promise<number>>(async (total, cartItem) => {
        const book = (await getBookById(cartItem.bookId)).data;
        book.price = +book.price;
        const newTotal = await total;
        return newTotal + (book.price || 0) * cartItem.quantity;
      }, new Promise<number>((res) => res(0)))
      .then((total) => {
        setTotalPrice(total);
        setTotalPriceFormatted(formatCurrency(total));
      });
  }, [cartItems]);

  const onBuy = (friendEmail: string, handleReset: any) => {
    buyItems(user.id!, friendEmail, totalPrice)
      .then((response) => {
        toast.success(response.data);
        user.shoppingCart = [];
        user.coins! -= totalPrice;
        updateUser({ ...user });
        handleReset();
        onCloseModal();
      })
      .catch((err: AxiosError<string>) => {
        toast.error(err.response?.data);
      });
  };

  return (
    <Formik
      validationSchema={schema}
      onSubmit={() => {}}
      initialValues={{
        giftSwitch: false,
        friendEmail: "",
      }}
    >
      {({ handleChange, handleReset, values, errors }) => (
        <Modal fullscreen show={show} onHide={onCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Checkout</Modal.Title>
          </Modal.Header>
          <Modal.Body className="w-100 h-100 d-flex">
            <div className="h-100 w-50 p-3 border-end">
              <h2 className="text-center mb-3">Shopping cart items</h2>
              <Stack gap={3}>
                {cartItems.map((item) => (
                  <CartItem key={item.bookId} {...item} />
                ))}
                <div className="ms-auto fw-bold fs-5">
                  Total {totalPriceFormatted}
                </div>
              </Stack>
            </div>
            <div className="h-100 w-50 p-3">
              <h2 className="text-center mb-3">Buy or gift</h2>
              <Form noValidate>
                <div style={{ height: 200 }}>
                  <Form.Group
                    className="mb-3 position-relative"
                    controlId="giftSwitch"
                  >
                    <Form.Switch
                      id="giftSwitch"
                      label="Gift to a friend"
                      onChange={handleChange}
                      checked={values.giftSwitch}
                    />
                  </Form.Group>
                  {values.giftSwitch && (
                    <Form.Group
                      className="mb-3 position-relative"
                      controlId="friendEmail"
                    >
                      <FloatingLabel
                        controlId="friendEmail"
                        label="Email address"
                      >
                        <Form.Control
                          id="friendEmail"
                          type="email"
                          placeholder="name@example.com"
                          name="friendEmail"
                          value={values.friendEmail}
                          onChange={handleChange}
                          isInvalid={!!errors.friendEmail}
                        />
                        <Form.Control.Feedback type="invalid" tooltip>
                          {errors.friendEmail}
                        </Form.Control.Feedback>
                      </FloatingLabel>
                    </Form.Group>
                  )}
                </div>
                <Stack gap={3}>
                  <div className="w-100 d-flex align-items-center justify-content-around">
                    <h3>Your balance:</h3>{" "}
                    <span className="ms-auto fw-bold fs-5">
                      {formatCurrency(user.coins!)}
                    </span>
                  </div>
                  <div className="ms-auto fw-bold fs-5 text-danger">
                    - {totalPriceFormatted}
                  </div>
                  <div className="w-100 d-flex align-items-center justify-content-around">
                    <h3>New balance:</h3>{" "}
                    <span className="ms-auto fw-bold fs-5">
                      {formatCurrency(+user.coins! - totalPrice)}
                    </span>
                  </div>
                </Stack>
              </Form>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="primary"
              disabled={!!errors.friendEmail || totalPrice > user.coins!}
              onClick={() => onBuy(values.friendEmail, handleReset)}
            >
              Buy
            </Button>
            <Button variant="secondary" onClick={onCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Formik>
  );
};

export default CheckoutModal;
