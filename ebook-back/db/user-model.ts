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
        "SELECT * FROM users WHERE email = $1",
        [email],
        (err, results) => {
          try {
            if (err || !results.rowCount) {
              resolve(null);
            } else {
              const dbUser = results.rows[0];
              pool.query<{ role_name: string }>(
                "SELECT role_name FROM roles WHERE role_id = $1",
                [dbUser.role_id],
                (err, results) => {
                  try {
                    if (err || !results.rowCount) {
                      resolve(null);
                    } else {
                      const user = new User(
                        dbUser.user_id,
                        dbUser.email,
                        dbUser.user_password,
                        dbUser.user_name,
                        dbUser.coins,
                        dbUser.first_name,
                        dbUser.last_name,
                        results.rows[0].role_name,
                        dbUser.avatar
                      );
                      resolve(user);
                    }
                  } catch (error) {
                    reject("Something went wrong!");
                  }
                }
              );
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
