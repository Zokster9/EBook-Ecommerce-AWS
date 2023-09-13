import PaymentIcon from "@mui/icons-material/Payment";
import { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import Offcanvas from "react-bootstrap/Offcanvas";
import Stack from "react-bootstrap/Stack";
import { useShoppingCart } from "../../context/ShoppingCartContext";
import { getBookById } from "../../services/BookService";
import { formatCurrency } from "../../utils/utils";
import CartItem from "../CartItem/CartItem";
import CheckoutModal from "../CheckoutModal/CheckoutModal";

type ShoppingCartProps = {
  isOpen: boolean;
};

const ShoppingCart = ({ isOpen }: ShoppingCartProps) => {
  const { closeCart, cartItems } = useShoppingCart();
  const [totalPriceFormatted, setTotalPriceFormatted] = useState<string>("0");
  const [showCheckoutModal, setShowCheckoutModal] = useState<boolean>(false);

  useEffect(() => {
    cartItems
      .reduce<Promise<number>>(async (total, cartItem) => {
        const book = (await getBookById(cartItem.bookId)).data;
        book.price = +book.price;
        const newTotal = await total;
        return newTotal + (book.price || 0) * cartItem.quantity;
      }, new Promise<number>((res) => res(0)))
      .then((total) => setTotalPriceFormatted(formatCurrency(total)));
  }, [cartItems]);

  return (
    <>
      <Offcanvas show={isOpen} onHide={closeCart} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Cart</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Stack gap={3}>
            {cartItems.map((item) => (
              <CartItem key={item.bookId} {...item} />
            ))}
            <div className="ms-auto fw-bold fs-5">
              Total {totalPriceFormatted}
            </div>
            <Button
              className="w-100"
              onClick={() => setShowCheckoutModal(true)}
            >
              <PaymentIcon /> Go to checkout
            </Button>
          </Stack>
        </Offcanvas.Body>
      </Offcanvas>
      <CheckoutModal
        show={showCheckoutModal}
        onCloseModal={() => setShowCheckoutModal(false)}
      />
    </>
  );
};

export default ShoppingCart;
