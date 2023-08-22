import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import ListGroup from "react-bootstrap/ListGroup";
import defaultCover from "../../assets/default_book_cover.png";
import { BookDTO } from "../../model/book-dto";
import { convertDateToString } from "../../utils/utils";
import "./BookCard.css";

interface BookProps {
  book: BookDTO;
}

const BookCard = ({ book }: BookProps) => {
  return (
    <Card
      bg="light"
      key="light"
      text="dark"
      style={{ width: "25rem", height: "885px" }}
      className="mb-2"
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
          style={{ height: 120 }}
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
        <Container className="d-flex w-100 align-items-center justify-content-around">
          <Button className="w-100" variant="dark">
            <span className="me-2">
              <FavoriteBorderIcon />
            </span>
            Add to wishlist
          </Button>
        </Container>
      </Card.Body>
    </Card>
  );
};

export default BookCard;
