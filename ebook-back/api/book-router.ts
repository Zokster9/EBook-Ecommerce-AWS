import express, { Request } from "express";
import { BookRepo } from "../db/book-model";
import { BookDTO } from "../model/book-dto";

export const bookRouter = express.Router();

bookRouter.get(
  "/",
  (req: Request<{}, {}, {}, { pageNum: number; limit: number }>, res) => {
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

bookRouter.get(
  "/:id",
  (req: Request<{ id: number }, BookDTO | string, {}>, res) => {
    const bookRepo = new BookRepo();
    bookRepo
      .findBookById(req.params.id)
      .then((bookDTO) => {
        if (bookDTO) {
          return res.status(200).json(bookDTO);
        } else {
          return res.status(500).send("Something went wrong");
        }
      })
      .catch((err) => {
        return res.status(500).send(err);
      });
  }
);
