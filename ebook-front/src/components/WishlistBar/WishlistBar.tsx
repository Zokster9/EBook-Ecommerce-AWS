import { AxiosError } from "axios";
import { useEffect, useState } from "react";
import Offcanvas from "react-bootstrap/Offcanvas";
import Stack from "react-bootstrap/Stack";
import { toast } from "react-toastify";
import { useUser } from "../../context/UserContext";
import { BookDTO } from "../../model/book-dto";
import { getBookById } from "../../services/BookService";
import WishListItem from "../WishlistItem/WishlistItem";

type WishlistBarProps = {
  isOpen: boolean;
};

const WishlistBar = ({ isOpen }: WishlistBarProps) => {
  const { closeWishlist, user } = useUser();
  const [wishlistBooks, setWishlistBooks] = useState<BookDTO[]>([]);

  useEffect(() => {
    if (!!user.id) {
      const wishlistBooks$ = user.wishlistBooks!.map((wishlistBook) =>
        getBookById(wishlistBook.bookId).then((response) => response.data)
      );
      Promise.all(wishlistBooks$)
        .then((books) => {
          setWishlistBooks(books);
        })
        .catch((err: AxiosError<string>) => {
          toast.error(err.response?.data);
        });
    }
  }, [user]);

  return (
    <Offcanvas show={isOpen} onHide={closeWishlist} placement="end">
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Wishlist</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <Stack gap={3}>
          {wishlistBooks.map((book) => (
            <WishListItem key={book.id} book={book} />
          ))}
        </Stack>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

export default WishlistBar;
