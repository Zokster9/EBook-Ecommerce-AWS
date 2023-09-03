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
        user_owned_books AS (SELECT u.user_id, COALESCE(json_agg(ob.*) FILTER (WHERE ob.book_id IS NOT NULL), '[]') as ownedBooks FROM users u LEFT JOIN owned_books ob ON u.user_id = ob.user_id WHERE u.email = $1 GROUP BY u.user_id)
        SELECT urb.*, uob.ownedbooks, r.role_name FROM user_owned_books uob INNER JOIN user_rented_books urb ON uob.user_id = urb.user_id INNER JOIN roles r ON urb.role_id = r.role_id;`,
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
              console.log(results.rows);
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
