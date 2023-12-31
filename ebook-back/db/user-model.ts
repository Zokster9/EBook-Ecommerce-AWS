import { RentedBookDB } from "../model/rentedBook-db";
import { RentedBookDTO } from "../model/rentedBook-dto";
import { User } from "../model/user";
import { UserCreation } from "../model/user-creation";
import { UserDB } from "../model/user-db";
import { pool } from "./pool";

interface IUserRepo {
  findByEmail(email: string): Promise<User | null>;
  registerUser(user: UserCreation): Promise<boolean>;
}

export class UserRepo implements IUserRepo {
  findByEmail(email: string): Promise<User | null> {
    return new Promise((resolve, reject) => {
      pool.query<UserDB>(
        `WITH user_rented_books AS (SELECT u.*, COALESCE(json_agg(rb.*) FILTER (WHERE rb.book_id IS NOT NULL), '[]') as rentedBooks FROM users u LEFT JOIN rented_books rb ON u.user_id = rb.user_id WHERE u.email = $1 GROUP BY u.user_id),
user_owned_books AS (SELECT u.user_id, COALESCE(json_agg(ob.*) FILTER (WHERE ob.book_id IS NOT NULL), '[]') as ownedBooks FROM users u LEFT JOIN owned_books ob ON u.user_id = ob.user_id WHERE u.email = $1 GROUP BY u.user_id),
user_wishlist_books AS (SELECT u.user_id, COALESCE(json_agg(w.book_id) FILTER (WHERE w.book_id IS NOT NULL), '[]') as wishlistbooks FROM users u LEFT JOIN wishlists w ON u.user_id = w.user_id WHERE u.email = $1 GROUP BY u.user_id),
user_shopping_cart AS (SELECT u.user_id, COALESCE(json_agg(sc.*) FILTER (WHERE sc.book_id IS NOT NULL), '[]') as shoppingCart FROM users u LEFT JOIN shopping_carts sc ON u.user_id = sc.user_id WHERE u.email = $1 GROUP BY u.user_id)

SELECT urb.*, uob.ownedbooks, uwb.wishlistbooks, usc.shoppingcart, r.role_name FROM user_owned_books uob INNER JOIN user_wishlist_books uwb ON uob.user_id = uwb.user_id INNER JOIN user_shopping_cart usc ON uwb.user_id = usc.user_id INNER JOIN user_rented_books urb ON usc.user_id = urb.user_id INNER JOIN roles r ON urb.role_id = r.role_id;`,
        [email],
        (err, results) => {
          try {
            if (err || !results.rowCount) {
              resolve(null);
            } else {
              const dbUser = results.rows[0];
              const user = new User(
                dbUser.user_id,
                dbUser.email,
                dbUser.user_password,
                dbUser.user_name,
                dbUser.coins,
                dbUser.first_name,
                dbUser.last_name,
                dbUser.role_name,
                dbUser.rentedbooks,
                dbUser.ownedbooks,
                dbUser.wishlistbooks,
                dbUser.shoppingcart,
                dbUser.avatar
              );
              resolve(user);
            }
          } catch (error) {
            reject("Something went wrong!");
          }
        }
      );
    });
  }

  registerUser(user: UserCreation): Promise<boolean> {
    return new Promise((resolve, reject) => {
      pool.query<UserDB>(
        "INSERT INTO users (email, first_name, last_name, user_password, role_id, avatar, user_name, coins) " +
          "VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
        [
          user.email,
          user.firstName,
          user.lastName,
          user.password,
          2,
          user.avatar,
          user.username,
          user.coins,
        ],
        (err, results) => {
          try {
            if (err || !results.rowCount) {
              resolve(false);
            } else {
              resolve(true);
            }
          } catch (error) {
            reject("Something went wrong!");
          }
        }
      );
    });
  }

  rentBook(userId: string, rentBookDTO: RentedBookDTO): Promise<boolean> {
    return new Promise((resolve, reject) => {
      pool.query<RentedBookDB>(
        `INSERT INTO rented_books (user_id, book_id, rent_date, is_returned) VALUES ($1, $2, $3, $4) RETURNING *`,
        [
          userId,
          rentBookDTO.bookId,
          rentBookDTO.rentDate,
          rentBookDTO.isReturned,
        ],
        (err, results) => {
          try {
            if (err || !results.rowCount) {
              resolve(false);
            } else {
              resolve(true);
            }
          } catch (error) {
            reject("Something went wrong!");
          }
        }
      );
    });
  }

  returnBook(userId: string, rentBookDTO: RentedBookDTO): Promise<boolean> {
    return new Promise((resolve, reject) => {
      pool.query<RentedBookDB>(
        `UPDATE rented_books SET is_returned = TRUE WHERE user_id = $1 AND book_id = $2 AND rent_date = $3 RETURNING *`,
        [userId, rentBookDTO.bookId, rentBookDTO.rentDate],
        (err, results) => {
          try {
            if (err || !results.rowCount) {
              resolve(false);
            } else {
              resolve(true);
            }
          } catch (error) {
            reject("Something went wrong!");
          }
        }
      );
    });
  }

  addToWishlist(userId: string, bookId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO wishlists (user_id, book_id) VALUES ($1, $2) RETURNING *`,
        [userId, bookId],
        (err, results) => {
          try {
            if (err || !results.rowCount) {
              resolve(false);
            } else {
              resolve(true);
            }
          } catch (error) {
            reject("Something went wrong!");
          }
        }
      );
    });
  }

  removeFromWishlist(userId: string, bookId: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      pool.query(
        `DELETE FROM wishlists WHERE user_id = $1 AND book_id = $2 RETURNING *`,
        [userId, bookId],
        (err, results) => {
          try {
            if (err || !results.rowCount) {
              resolve(false);
            } else {
              resolve(true);
            }
          } catch (error) {
            reject("Something went wrong!");
          }
        }
      );
    });
  }

  updateCoins(coins: number, userId: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      pool.query(
        `UPDATE users SET coins = $1 WHERE user_id = $2`,
        [coins, userId],
        (err, results) => {
          try {
            if (err || !results.rowCount) {
              resolve(false);
            } else {
              resolve(true);
            }
          } catch (error) {
            reject("Something went wrong!");
          }
        }
      );
    });
  }

  addToCart(
    userId: number,
    bookId: number,
    quantity: number
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO shopping_carts (user_id, book_id, quantity)
     VALUES ($1, $2, $3) ON CONFLICT(user_id, book_id) WHERE book_id = $2
DO UPDATE SET quantity = $3;`,
        [userId, bookId, quantity],
        (err, results) => {
          try {
            if (err || !results.rowCount) {
              resolve(false);
            } else {
              resolve(true);
            }
          } catch (error) {
            reject("Something went wrong!");
          }
        }
      );
    });
  }

  decreaseFromCart(
    userId: number,
    bookId: number,
    quantity: number
  ): Promise<boolean> {
    return new Promise((resolve, reject) => {
      pool.query(
        `UPDATE shopping_carts SET quantity = $3 WHERE user_id = $1 AND book_id = $2;`,
        [userId, bookId, quantity],
        (err, results) => {
          try {
            if (err || !results.rowCount) {
              resolve(false);
            } else {
              resolve(true);
            }
          } catch (error) {
            reject("Something went wrong!");
          }
        }
      );
    });
  }

  removeFromCart(userId: number, bookId: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      pool.query(
        `DELETE FROM shopping_carts WHERE user_id = $1 AND book_id = $2;`,
        [userId, bookId],
        (err, results) => {
          try {
            if (err || !results.rowCount) {
              resolve(false);
            } else {
              resolve(true);
            }
          } catch (error) {
            reject("Something went wrong!");
          }
        }
      );
    });
  }

  buyFromCart(ownerId: number, userId: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      pool.query(
        `INSERT INTO owned_books (user_id, book_id, quantity, buy_date) SELECT $1, book_id, quantity, NOW() FROM shopping_carts WHERE user_id = $2;`,
        [ownerId, userId],
        (err, results) => {
          try {
            if (err || !results.rowCount) {
              resolve(false);
            } else {
              resolve(true);
            }
          } catch (error) {
            reject("Something went wrong!");
          }
        }
      );
    });
  }

  emptyCart(userId: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      pool.query(
        `DELETE FROM shopping_carts WHERE user_id = $1;`,
        [userId],
        (err, results) => {
          try {
            if (err || !results.rowCount) {
              resolve(false);
            } else {
              resolve(true);
            }
          } catch (error) {
            reject("Something went wrong!");
          }
        }
      );
    });
  }

  userHasEnoughCoins(userId: number, totalPrice: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      pool.query(
        `SELECT * FROM users WHERE user_id = $1 AND coins > $2;`,
        [userId, totalPrice],
        (err, results) => {
          try {
            if (err || !results.rowCount) {
              resolve(false);
            } else {
              resolve(true);
            }
          } catch (error) {
            reject("Something went wrong!");
          }
        }
      );
    });
  }

  subtractCoins(userId: number, totalPrice: number): Promise<boolean> {
    return new Promise((resolve, reject) => {
      pool.query(
        `UPDATE users SET coins = coins - $1 WHERE user_id = $2;`,
        [totalPrice, userId],
        (err, results) => {
          try {
            if (err || !results.rowCount) {
              resolve(false);
            } else {
              resolve(true);
            }
          } catch (error) {
            reject("Something went wrong!");
          }
        }
      );
    });
  }
}
