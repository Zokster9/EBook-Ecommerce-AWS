import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import { toast } from "react-toastify";
import defaultCover from "../../assets/default_book_cover.png";
import { useShoppingCart } from "../../context/ShoppingCartContext";
import { BookDTO } from "../../model/book-dto";
import { getBookById } from "../../services/BookService";
import { formatCurrency } from "../../utils/utils";

type CartItemProps = {
  bookId: number;
  quantity: number;
};

const CartItem = ({ bookId, quantity }: CartItemProps) => {
  const { removeFromCart } = useShoppingCart();
  const [book, setBook] = useState<BookDTO>();

  useEffect(() => {
    getBookById(bookId)
      .then((bookResponse) => {
        setBook(bookResponse.data);
      })
      .catch((err: AxiosError<string>) => {
        toast.error(err.response?.data);
      });
  }, [bookId]);

  return (
    <Stack direction="horizontal" gap={2} className="d-flex align-items-center">
      <img
        src={book?.cover ? book.cover : defaultCover}
        alt="cart item"
        style={{
          width: 125,
          height: 75,
          minHeight: 75,
          maxHeight: 75,
          minWidth: 125,
          maxWidth: 125,
          objectFit: "cover",
        }}
      />
      <div className="me-auto">
        <div>
          {book?.title}{" "}
          {quantity > 1 && (
            <span className="text-muted" style={{ fontSize: ".65rem" }}>
              x{quantity}
            </span>
          )}
        </div>
        <div className="text-muted" style={{ fontSize: ".75rem" }}>
          {formatCurrency(book ? book.price : 0)}
        </div>
      </div>
      <div> {formatCurrency(book ? book.price * quantity : 0)}</div>
      <Button
        variant="outline-danger"
        size="sm"
        onClick={() => removeFromCart(book ? book.id : 0)}
      >
        &times;
      </Button>
    </Stack>
  );
};

export default CartItem;
