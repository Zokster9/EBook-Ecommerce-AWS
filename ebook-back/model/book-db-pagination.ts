import { BookDb } from "./book-db";

export interface BooksDbPaginated {
  totalcount: number;
  books: BookDb[];
}
