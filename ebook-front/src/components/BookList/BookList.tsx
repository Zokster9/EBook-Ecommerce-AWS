import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import { BookDTO } from "../../model/book-dto";
import BookCard from "../BookCard/BookCard";

interface BookListProps {
  books: BookDTO[];
}

const BookList = ({ books }: BookListProps) => {
  return (
    <Container fluid>
      <Row xs={1} sm={1} md={2} lg={4}>
        {books.map((book) => {
          return (
            <div key={book.id} className="p-3 col-sm-3">
              <BookCard book={book} />
            </div>
          );
        })}
      </Row>
    </Container>
  );
};

export default BookList;
