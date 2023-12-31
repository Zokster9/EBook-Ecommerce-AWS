import { OwnedBookDB } from "./ownedBook-db";
import { RentedBookDB } from "./rentedBook-db";
import { ShoppingCartDb } from "./shoppingCart-db";

export interface UserDB {
  user_id: number;
  email: string;
  first_name: string;
  last_name: string;
  user_password: string;
  avatar?: string;
  user_name: string;
  coins: number;
  rentedbooks: RentedBookDB[];
  ownedbooks: OwnedBookDB[];
  wishlistbooks: number[];
  shoppingcart: ShoppingCartDb[];
  role_name: string;
}
