import { OwnedBook } from "./ownedBook";
import { OwnedBookDB } from "./ownedBook-db";
import { RentedBook } from "./rentedBook";
import { RentedBookDB } from "./rentedBook-db";
import { ShoppingCart } from "./shoppingCart";
import { ShoppingCartDb } from "./shoppingCart-db";
import { WishlistBook } from "./wishlist";

export class User {
  id: number;
  email: string;
  password: string;
  username: string;
  coins: number;
  avatar?: string;
  name: { firstName: string; lastName: string };
  role: string;
  rentedBooks: RentedBook[];
  ownedBooks: OwnedBook[];
  wishlistBooks: WishlistBook[];
  shoppingCart: ShoppingCart[];

  constructor(
    id: number,
    email: string,
    password: string,
    username: string,
    coins: number,
    firstName: string,
    lastName: string,
    role: string,
    rentedBooks: RentedBookDB[],
    ownedBooks: OwnedBookDB[],
    wishlistBooks: number[],
    shoppingCart: ShoppingCartDb[],
    avatar?: string
  ) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.username = username;
    this.coins = coins;
    this.avatar = avatar;
    this.name = { firstName, lastName };
    this.role = role;
    this.rentedBooks = rentedBooks.map<RentedBook>((rentedBook) => ({
      bookId: rentedBook.book_id,
      rentDate: rentedBook.rent_date,
      isReturned: rentedBook.is_returned,
    }));
    this.ownedBooks = ownedBooks.map<OwnedBook>((ownedBook) => ({
      bookId: ownedBook.book_id,
      buyDate: ownedBook.buy_date,
    }));
    this.wishlistBooks = wishlistBooks.map<WishlistBook>((wishlistBook) => ({
      bookId: wishlistBook,
    }));
    this.shoppingCart = shoppingCart.map<ShoppingCart>((cartItem) => ({
      bookId: cartItem.book_id,
      quantity: cartItem.quantity,
    }));
  }

  get firstName(): string {
    return this.name.firstName;
  }

  get lastName(): string {
    return this.name.lastName;
  }

  get fullName(): string {
    return `${this.name.firstName} ${this.name.lastName}`;
  }
}
