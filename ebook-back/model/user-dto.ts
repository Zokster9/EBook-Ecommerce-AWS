import { OwnedBookDTO } from "./ownedBook-dto";
import { RentedBookDTO } from "./rentedBook-dto";
import { ShoppingCartDTO } from "./shoppingCart-dto";
import { WishlistBookDTO } from "./wishlist-dto";

export interface UserDTO {
  id: number;
  email: string;
  username: string;
  coins: number;
  firstName: string;
  lastName: string;
  role: string;
  rentedBooks: RentedBookDTO[];
  ownedBooks: OwnedBookDTO[];
  wishlistBooks: WishlistBookDTO[];
  shoppingCart: ShoppingCartDTO[];
  avatar?: string;
}
