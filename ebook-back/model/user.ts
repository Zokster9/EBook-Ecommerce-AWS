import { OwnedBook } from "./ownedBook";
import { OwnedBookDB } from "./ownedBook-db";
import { RentedBook } from "./rentedBook";
import { RentedBookDB } from "./rentedBook-db";

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
