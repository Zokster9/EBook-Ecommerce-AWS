import bcrypt from "bcrypt";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { UserRepo } from "../../db/user-model";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    (username, password, done) => {
      const userRepo = new UserRepo();
      return userRepo
        .findByEmail(username)
        .then((user) => {
          if (!user) {
            return done(null, false, { message: "Incorrect credentials" });
          } else {
            bcrypt
              .compare(password, user.password)
              .then((arePasswordsMatching) => {
                if (arePasswordsMatching) {
                  return done(null, user, {
                    message: "Logged in successfully",
                  });
                } else {
                  return done(null, false, {
                    message: "Incorrect credentials",
                  });
                }
              });
          }
        })
        .catch((err) => done(err));
    }
  )
);

export default passport;
