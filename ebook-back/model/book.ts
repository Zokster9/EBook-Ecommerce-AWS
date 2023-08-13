export class Book {
  id: number;
  title: string;
  description: string;
  isbn: string;
  quantity: number;
  available: number;
  cover?: string;
  publishDate: Date;
  price: number;
  genres: string[];
  authors: { firstName: string; lastName: string }[];

  constructor(
    id: number,
    title: string,
    description: string,
    isbn: string,
    quantity: number,
    available: number,
    publish_date: Date,
    price: number,
    genres: string[],
    authors: string[],
    cover?: string
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.isbn = isbn;
    this.quantity = quantity;
    this.available = available;
    this.publishDate = publish_date;
    this.price = price;
    this.genres = genres;
    this.authors = authors.map((author) => ({
      firstName: author.split("_")[0],
      lastName: author.split("_")[1],
    }));
    this.cover = cover;
  }
}
