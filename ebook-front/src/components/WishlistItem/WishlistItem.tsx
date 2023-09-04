import Button from "react-bootstrap/Button";
import Stack from "react-bootstrap/Stack";
import defaultCover from "../../assets/default_book_cover.png";
import { useUser } from "../../context/UserContext";
import { BookDTO } from "../../model/book-dto";

type WishListItemProps = {
  book: BookDTO;
};

const WishListItem = ({ book }: WishListItemProps) => {
  const { removeItemFromWishlist } = useUser();

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
        <div>{book?.title} </div>
      </div>
      <Button
        variant="outline-danger"
        size="sm"
        onClick={() => removeItemFromWishlist(book ? book.id : 0)}
      >
        &times;
      </Button>
    </Stack>
  );
};

export default WishListItem;
