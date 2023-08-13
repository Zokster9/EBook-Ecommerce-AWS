import { BookDb } from "./book-db";

export interface BookDbPaginated {
  totalcount: number;
  books: BookDb[];
}
