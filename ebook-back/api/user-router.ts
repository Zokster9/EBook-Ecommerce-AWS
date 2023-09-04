import express, { Request, Response } from "express";
import { UserRepo } from "../db/user-model";
import { RentedBookDTO } from "../model/rentedBook-dto";
import passport from "./authentication/passport";
export const userRouter = express.Router();

userRouter.post(
  "/:id/rent-book",
  passport.authenticate("jwt", { session: false }),
  (
    req: Request<{ id: string }, { rentBookDTO: RentedBookDTO }>,
    res: Response
  ) => {
    const userRepo = new UserRepo();
    const userId = req.params.id;
    const rentBookDTO = req.body;
    userRepo
      .rentBook(userId, rentBookDTO)
      .then((isSuccessful) => {
        if (isSuccessful) {
          return res.status(201).send("Book successfully rented");
        } else {
          return res.status(500).send("Book could not be rented");
        }
      })
      .catch((err) => {
        return res.status(500).send(err);
      });
  }
);

userRouter.put(
  "/:id/return-book",
  passport.authenticate("jwt", { session: false }),
  (
    req: Request<{ id: string }, { rentBookDTO: RentedBookDTO }>,
    res: Response
  ) => {
    const userRepo = new UserRepo();
    const userId = req.params.id;
    const rentBookDTO = req.body;
    userRepo
      .returnBook(userId, rentBookDTO)
      .then((isSuccessful) => {
        if (isSuccessful) {
          return res.status(201).send("Book successfully returned");
        } else {
          return res.status(500).send("Book could not be returned");
        }
      })
      .catch((err) => {
        return res.status(500).send(err);
      });
  }
);

userRouter.post(
  "/:userId/wishlist/:bookId",
  passport.authenticate("jwt", { session: false }),
  (req: Request<{ userId: string; bookId: string }>, res: Response) => {
    const userRepo = new UserRepo();
    const userId = req.params.userId;
    const bookId = req.params.bookId;
    userRepo
      .addToWishlist(userId, bookId)
      .then((isSuccessful) => {
        if (isSuccessful) {
          return res.status(201).send("Book successfully wishlisted");
        } else {
          return res.status(500).send("Book could not be wishlisted");
        }
      })
      .catch((err) => {
        return res.status(500).send(err);
      });
  }
);

userRouter.delete(
  "/:userId/wishlist/:bookId",
  passport.authenticate("jwt", { session: false }),
  (req: Request<{ userId: string; bookId: string }>, res: Response) => {
    const userRepo = new UserRepo();
    const userId = req.params.userId;
    const bookId = req.params.bookId;
    userRepo
      .removeFromWishlist(userId, bookId)
      .then((isSuccessful) => {
        if (isSuccessful) {
          return res
            .status(204)
            .send("Book successfully removed from wishlist");
        } else {
          return res
            .status(500)
            .send("Book could not be removed from wishlist");
        }
      })
      .catch((err) => {
        return res.status(500).send(err);
      });
  }
);
