import bcrypt from "bcrypt";
import dotenv from "dotenv";
import passport from "passport";
import {
  ExtractJwt,
  Strategy as JwtStrategy,
  StrategyOptions,
} from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import { UserRepo } from "../../db/user-model";
import { UserDTO } from "../../model/user-dto";

dotenv.config();

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

const jwtStrategyOptions: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWTSECRET,
};

passport.use(
  new JwtStrategy(jwtStrategyOptions, (jwtPayload: UserDTO, done) => {
    const userRepo = new UserRepo();
    return userRepo
      .findByEmail(jwtPayload.email)
      .then((user) => {
        if (!user) {
          return done(null, false);
        } else {
          return done(null, user);
        }
      })
      .catch((err) => done(err));
  })
);

export default passport;
