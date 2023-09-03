import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import HandshakeIcon from "@mui/icons-material/Handshake";
import KeyboardReturnIcon from "@mui/icons-material/KeyboardReturn";
import { AxiosError } from "axios";
import { MouseEvent, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import { toast } from "react-toastify";
import defaultCover from "../../assets/default_book_cover.png";
import { useShoppingCart } from "../../context/ShoppingCartContext";
import { useUser } from "../../context/UserContext";
import { BookDTO } from "../../model/book-dto";
import { rentBook, returnBook } from "../../services/UserService";
import { convertDateToString } from "../../utils/utils";
import "./BookCard.css";

interface BookProps {
  book: BookDTO;
}

const BookCard = ({ book }: BookProps) => {
  const {
    getItemQuantity,
    increaseCartQuantity,
    decreaseCartQuantity,
    removeFromCart,
  } = useShoppingCart();
  const quantity = getItemQuantity(book.id);
  const { user, updateUser } = useUser();
  const [isBookRented, setIsBookRented] = useState<boolean>(false);

  useEffect(() => {
    if (user.rentedBooks) {
      setIsBookRented(
        user.rentedBooks.some(
          (rentedBook) =>
            rentedBook.bookId === book.id && !rentedBook.isReturned
        )
      );
    }
  }, [user, book.id]);

  const onRentBookClick = (e: MouseEvent) => {
    e.stopPropagation();
    const rentedBookDTO = {
      bookId: book.id,
      rentDate: new Date(),
      isReturned: false,
    };
    rentBook(user.id!, rentedBookDTO)
      .then((response) => {
        user.rentedBooks = [...user.rentedBooks!, rentedBookDTO];
        updateUser(user);
        toast.success(response.data);
      })
      .catch((err: AxiosError<{ message: string }>) => {
        toast.error(err.response?.data.message);
      });
  };

  const onReturnBookClick = (e: MouseEvent) => {
    e.stopPropagation();
    const returnedBook = user.rentedBooks!.filter(
      (rentedBook) => rentedBook.bookId === book.id && !rentedBook.isReturned
    )[0];
    returnBook(user.id!, returnedBook)
      .then((response) => {
        returnedBook.isReturned = true;
        updateUser(user);
        toast.success(response.data);
      })
      .catch((err: AxiosError<{ message: string }>) => {
        toast.error(err.response?.data.message);
      });
  };

  return (
    <Card
      bg="light"
      key="light"
      text="dark"
      style={{ width: "25rem", height: "885px" }}
      className="book-card mb-2"
    >
      <Card.Img
        variant="top"
        className="object-fit-cover"
        height={350}
        width={300}
        src={book.cover ? book.cover : defaultCover}
      />
      <Card.Header>
        {book.authors
          .map((author) => `${author.firstName} ${author.lastName}`)
          .join(", ")}
      </Card.Header>
      <Card.Body>
        <Card.Title style={{ height: 50 }}>{book.title}</Card.Title>
        <Card.Text
          style={{ height: 70 }}
          className="w-100 text-truncate-container"
        >
          {book.description}
        </Card.Text>
        <ListGroup variant="flush" className="mb-3">
          <ListGroup.Item>
            <div className="d-flex justify-content-around">
              <div className="fw-bold flex-grow-1">Publish date</div>
              {convertDateToString(new Date(book.publishDate))}
            </div>
          </ListGroup.Item>
          <ListGroup.Item>
            <div className="d-flex justify-content-around">
              <div className="fw-bold flex-grow-1">Genres</div>
              {book.genres.join(", ")}
            </div>
          </ListGroup.Item>
          <ListGroup.Item>
            <div className="d-flex justify-content-around">
              <div className="fw-bold flex-grow-1">ISBN</div>
              {book.isbn}
            </div>
          </ListGroup.Item>
        </ListGroup>
        <Card.Text className="fw-bold">Price: {book.price}$</Card.Text>
        {user.id && (
          <>
            <Container className="d-flex w-100 align-items-center justify-content-around mb-2 gap-2">
              <Button style={{ height: 60 }} className="w-50" variant="dark">
                <span className="me-2">
                  <FavoriteBorderIcon />
                </span>
                Add to wishlist
              </Button>
              {isBookRented ? (
                <>
                  <Button
                    style={{ height: 60 }}
                    className="w-50"
                    variant="dark"
                    onClick={onReturnBookClick}
                  >
                    <span className="me-2">
                      <KeyboardReturnIcon />
                    </span>
                    Return the book
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    style={{ height: 60 }}
                    className="w-50"
                    variant="dark"
                    onClick={onRentBookClick}
                  >
                    <span className="me-2">
                      <HandshakeIcon />
                    </span>
                    Rent the book
                  </Button>
                </>
              )}
            </Container>
            <Container className="d-flex w-100 align-items-center justify-content-around">
              {quantity === 0 ? (
                <Button
                  className="w-100"
                  onClick={(e: MouseEvent) => {
                    e.stopPropagation();
                    return increaseCartQuantity(book.id);
                  }}
                >
                  <AddShoppingCartIcon /> Add To Cart
                </Button>
              ) : (
                <div
                  className="d-flex align-items-center flex-column"
                  style={{ gap: ".5rem" }}
                >
                  <div
                    className="d-flex align-items-center justify-content-center"
                    style={{ gap: ".5rem" }}
                  >
                    <Button
                      onClick={(e: MouseEvent) => {
                        e.stopPropagation();
                        return decreaseCartQuantity(book.id);
                      }}
                    >
                      -
                    </Button>
                    <div>
                      <span className="fs-3">{quantity}</span> in cart
                    </div>
                    <Button
                      onClick={(e: MouseEvent) => {
                        e.stopPropagation();
                        return increaseCartQuantity(book.id);
                      }}
                    >
                      +
                    </Button>
                    <Button
                      onClick={(e: MouseEvent) => {
                        e.stopPropagation();
                        return removeFromCart(book.id);
                      }}
                      variant="danger"
                      size="sm"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              )}
            </Container>
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default BookCard;
