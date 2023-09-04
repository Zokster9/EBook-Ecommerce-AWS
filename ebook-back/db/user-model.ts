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
user_wishlist_books AS (SELECT u.user_id, COALESCE(json_agg(w.book_id) FILTER (WHERE w.book_id IS NOT NULL), '[]') as wishlistbooks FROM users u LEFT JOIN wishlists w ON u.user_id = w.user_id WHERE u.email = $1 GROUP BY u.user_id)

SELECT urb.*, uob.ownedbooks, uwb.wishlistbooks, r.role_name FROM user_owned_books uob INNER JOIN user_wishlist_books uwb ON uob.user_id = uwb.user_id INNER JOIN user_rented_books urb ON uwb.user_id = urb.user_id INNER JOIN roles r ON urb.role_id = r.role_id;`,
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
}
