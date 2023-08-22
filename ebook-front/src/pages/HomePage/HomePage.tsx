import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import InfiniteScroll from "react-infinite-scroll-component";
import BookList from "../../components/BookList/BookList";
import { BookDTO } from "../../model/book-dto";
import { getBooks } from "../../services/BookService";

interface Page {
  pageNumber: number;
  pageLength: number;
  totalCount: number;
}

const HomePage = () => {
  const [page, setPage] = useState<Page>({
    pageNumber: 1,
    pageLength: 10,
    totalCount: -1,
  });
  const [books, setBooks] = useState<BookDTO[]>([]);
  const [hasMoreBooks, setHasMoreBooks] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBooks = (pageNumber: number, pageLength: number) => {
    setIsLoading(true);
    getBooks({ pageNumber, pageLength })
      .then((response) => {
        const totalNumOfBooks = response.data.totalCount;
        const currentCount = pageNumber * pageLength;
        const newBooks = response.data.books;
        setHasMoreBooks(totalNumOfBooks - currentCount > 0);
        setPage((page) => {
          return {
            ...page,
            totalCount: totalNumOfBooks,
          };
        });
        setBooks((prevBooks) => [...prevBooks, ...newBooks]);
        setIsLoading(false);
      })
      .catch(() => {
        setBooks([]);
        setIsLoading(false);
      });
  };

  const resetPaging = () => {
    setPage((page) => {
      return {
        ...page,
        totalCount: -1,
        pageNumber: 1,
      };
    });
    setHasMoreBooks(true);
    setBooks([]);
  };

  useEffect(() => {
    fetchBooks(page.pageNumber, page.pageLength);
  }, [page.pageNumber, page.pageLength]);

  const handleNextPage = () => {
    setPage((page) => {
      return {
        ...page,
        pageNumber: page.pageNumber + 1,
      };
    });
  };

  return (
    <Container fluid>
      {page.totalCount !== 0 ? (
        <InfiniteScroll
          dataLength={books.length}
          next={handleNextPage}
          hasMore={hasMoreBooks}
          loader={
            <>
              {isLoading && (
                <div className="loader">
                  <Spinner animation="border" />
                </div>
              )}
            </>
          }
          endMessage={
            <h4 style={{ textAlign: "center", marginTop: 30 }}>
              You have browsed all books
            </h4>
          }
        >
          <BookList books={books} />
        </InfiniteScroll>
      ) : (
        <h3 style={{ textAlign: "center" }}>No books currently available</h3>
      )}
    </Container>
  );
};

export default HomePage;
