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

userRouter.post(
  "/:userId/add-to-cart",
  passport.authenticate("jwt", { session: false }),
  (
    req: Request<{ userId: number }, {}, { bookId: number; quantity: number }>,
    res
  ) => {
    const userId = req.params.userId;
    const bookId = req.body.bookId;
    const quantity = req.body.quantity;
    const userRepo = new UserRepo();
    userRepo
      .addToCart(userId, bookId, quantity)
      .then((isSuccessful) => {
        if (isSuccessful) {
          return res
            .status(200)
            .send("Successfully added a book to the shopping cart");
        } else {
          return res
            .status(500)
            .send("Book could not be added to a shopping cart");
        }
      })
      .catch((err) => {
        return res.status(500).send(err);
      });
  }
);

userRouter.post(
  "/:userId/decrease-from-cart",
  passport.authenticate("jwt", { session: false }),
  (
    req: Request<{ userId: number }, {}, { bookId: number; quantity: number }>,
    res
  ) => {
    const userId = req.params.userId;
    const bookId = req.body.bookId;
    const quantity = req.body.quantity;
    const userRepo = new UserRepo();
    if (quantity !== 0) {
      userRepo
        .decreaseFromCart(userId, bookId, quantity)
        .then((isSuccessful) => {
          if (isSuccessful) {
            return res
              .status(200)
              .send("Successfully removed a book item from the shopping cart");
          } else {
            return res
              .status(500)
              .send("Book item could not be removed from a shopping cart");
          }
        })
        .catch((err) => {
          return res.status(500).send(err);
        });
    } else {
      userRepo
        .removeFromCart(userId, bookId)
        .then((isSuccessful) => {
          if (isSuccessful) {
            return res
              .status(200)
              .send("Successfully removed a book from the shopping cart");
          } else {
            return res
              .status(500)
              .send("Book could not be removed from a shopping cart");
          }
        })
        .catch((err) => {
          return res.status(500).send(err);
        });
    }
  }
);

userRouter.delete(
  "/:userId/remove-from-cart/:bookId",
  passport.authenticate("jwt", { session: false }),
  (req: Request<{ userId: number; bookId: number }>, res) => {
    const userId = req.params.userId;
    const bookId = req.params.bookId;
    const userRepo = new UserRepo();
    userRepo
      .removeFromCart(userId, bookId)
      .then((isSuccessful) => {
        if (isSuccessful) {
          return res
            .status(200)
            .send("Successfully removed a book from the shopping cart");
        } else {
          return res
            .status(500)
            .send("Book could not be removed from a shopping cart");
        }
      })
      .catch((err) => {
        return res.status(500).send(err);
      });
  }
);
