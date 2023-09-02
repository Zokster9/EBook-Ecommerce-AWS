import { Book } from "../model/book";
import { BookDb } from "../model/book-db";
import { BooksDbPaginated } from "../model/book-db-pagination";
import { BookDTO } from "../model/book-dto";
import { BooksDTO } from "../model/books-dto";
import { pool } from "./pool";

interface IBookRepo {
  findBooksPaginated(pageNum: number, limit: number): Promise<any>;
}

export class BookRepo implements IBookRepo {
  findBooksPaginated(pageNum: number, limit: number): Promise<BooksDTO | null> {
    return new Promise((resolve, reject) => {
      pool.query<BooksDbPaginated>(
        `WITH books_genres AS
	        (SELECT b.*, json_agg(g.genre_name) as genreNames FROM books b INNER JOIN book_genres bg ON b.book_id = bg.book_id INNER JOIN genres g ON bg.genre_id = g.genre_id GROUP BY b.book_id),
	      books_authors AS 
	        (SELECT b.book_id, json_agg(a.first_name || '_' || a.last_name) as authorNames FROM books b INNER JOIN book_authors ba ON b.book_id = ba.book_id INNER JOIN authors a ON ba.author_id = a.author_id GROUP BY b.book_id)
        SELECT (SELECT COUNT(*) FROM books) as totalCount, (SELECT json_agg(books.*) FROM 
          (SELECT bgs.*, bas.authornames FROM books_genres bgs INNER JOIN books_authors bas ON bgs.book_id = bas.book_id ORDER BY bgs.book_id OFFSET $1 LIMIT $2) AS books) AS books;`,
        [pageNum * limit - limit, limit],
        (err, results) => {
          try {
            if (err || !results.rowCount) {
              resolve(null);
            } else {
              const booksDb = results.rows[0];
              const books = booksDb.books.map(
                (book) =>
                  new Book(
                    book.book_id,
                    book.title,
                    book.description,
                    book.isbn,
                    book.quantity,
                    book.available,
                    book.publish_date,
                    book.price,
                    book.genrenames,
                    book.authornames,
                    book.cover
                  )
              );
              resolve({
                totalCount: booksDb.totalcount,
                books: [...books],
              });
            }
          } catch (err) {
            reject(err);
          }
        }
      );
    });
  }

  findBookById(bookId: number): Promise<BookDTO | null> {
    return new Promise((resolve, reject) => {
      pool.query<BookDb>(
        `WITH books_genres AS
	        (SELECT b.*, json_agg(g.genre_name) as genreNames FROM books b INNER JOIN book_genres bg ON b.book_id = bg.book_id INNER JOIN genres g ON bg.genre_id = g.genre_id WHERE b.book_id = $1 GROUP BY b.book_id),
	      books_authors AS 
	        (SELECT b.book_id, json_agg(a.first_name || '_' || a.last_name) as authorNames FROM books b INNER JOIN book_authors ba ON b.book_id = ba.book_id INNER JOIN authors a ON ba.author_id = a.author_id WHERE b.book_id = $1 GROUP BY b.book_id)
          SELECT bgs.*, bas.authornames FROM books_genres bgs INNER JOIN books_authors bas ON bgs.book_id = bas.book_id ORDER BY bgs.book_id;`,
        [bookId],
        (err, results) => {
          try {
            if (err || !results.rowCount) {
              resolve(null);
            } else {
              const bookDb = results.rows[0];
              const book: BookDTO = new Book(
                bookDb.book_id,
                bookDb.title,
                bookDb.description,
                bookDb.isbn,
                bookDb.quantity,
                bookDb.available,
                bookDb.publish_date,
                bookDb.price,
                bookDb.genrenames,
                bookDb.authornames,
                bookDb.cover
              );
              resolve(book);
            }
          } catch (err) {
            reject(err);
          }
        }
      );
    });
  }
}
