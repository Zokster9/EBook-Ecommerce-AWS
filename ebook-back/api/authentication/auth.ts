import dotenv from "dotenv";
import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { UserRepo } from "../../db/user-model";
import { User } from "../../model/user";
import { UserCreation } from "../../model/user-creation";
import { UserCreationDTO } from "../../model/user-creation-dto";
import { UserDTO } from "../../model/user-dto";
import { isRegisterBodyValid } from "../../utils/validators";
import passport from "./passport";

dotenv.config();

export const authRouter = express.Router();

const isAdminAuthenticated =
  (passport.authenticate("jwt", { session: false }),
  (
    req: Request<{}, {}, { user: UserDTO }>,
    res: Response,
    next: NextFunction
  ) => {
    req.body.user = req.user as UserDTO;
    if (req.body.user.role === "ROLE_ADMIN") {
      return next();
    }
    res.status(401).send("Unauthorized!");
  });

authRouter.post(
  "/register",
  isRegisterBodyValid,
  (req: Request<{}, {}, UserCreationDTO>, res: Response) => {
    const userRepo = new UserRepo();
    const userCreationDTO = req.body;
    const userCreation = new UserCreation(
      userCreationDTO.email,
      userCreationDTO.username,
      0,
      userCreationDTO.firstName,
      userCreationDTO.lastName,
      userCreationDTO.avatar
    );
    userCreation.setPassword(userCreationDTO.password).then((password) => {
      userCreation.password = password;
      userRepo
        .registerUser(userCreation)
        .then((isSuccessful) => {
          if (isSuccessful) {
            return res.status(201).json("User successfully registered!");
          } else {
            return res.status(500).json("User could not be registered!");
          }
        })
        .catch((err) => {
          return res.status(500).json(err);
        });
    });
  }
);

authRouter.post("/login", (req, res, next) => {
  passport.authenticate(
    "local",
    { session: false },
    (err: any, user: User, info: string) => {
      if (err || !user) {
        return res.status(400).send(info);
      } else {
        req.login(user, { session: false }, (err: any) => {
          if (err) {
            res.send(err);
          } else {
            const userDTO: UserDTO = {
              ...user,
              firstName: user.firstName,
              lastName: user.lastName,
            };
            const token = jwt.sign(userDTO, process.env.JWTSECRET!);
            return res
              .status(200)
              .cookie("jwt", token, {
                httpOnly: true,
              })
              .json({ token: token });
          }
        });
      }
    }
  )(req, res, next);
});

authRouter.post(
  "/logout",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      res.sendStatus(200);
    });
  }
);
