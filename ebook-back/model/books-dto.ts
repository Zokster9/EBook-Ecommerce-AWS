import { BookDTO } from "./book-dto";

export interface BooksDTO {
  totalCount: number;
  books: BookDTO[];
}
