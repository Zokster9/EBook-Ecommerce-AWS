import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { MouseEvent } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import defaultCover from "../../assets/default_book_cover.png";
import { useShoppingCart } from "../../context/ShoppingCartContext";
import { useUser } from "../../context/UserContext";
import { BookDTO } from "../../model/book-dto";
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
  const { getUser } = useUser();
  const user = getUser();
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
        height={400}
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
            <Container className="d-flex w-100 align-items-center justify-content-around mb-2">
              <Button className="w-100" variant="dark">
                <span className="me-2">
                  <FavoriteBorderIcon />
                </span>
                Add to wishlist
              </Button>
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
