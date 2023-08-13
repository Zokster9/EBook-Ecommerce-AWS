import express, { Request } from "express";
import { BookRepo } from "../db/book-model";

export const bookRouter = express.Router();

bookRouter.get(
  "/",
  (req: Request<{}, {}, {}, { pageNum: number; limit: number }>, res, next) => {
    const bookRepo = new BookRepo();
    bookRepo
      .findBooksPaginated(req.query.pageNum, req.query.limit)
      .then((booksDTO) => {
        if (booksDTO) {
          return res.status(200).json(booksDTO);
        } else {
          return res.status(500).send("Something went wrong");
        }
      })
      .catch((err) => {
        return res.status(500).send(err);
      });
  }
);
